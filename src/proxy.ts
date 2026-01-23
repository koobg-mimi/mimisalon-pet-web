import auth from '@/lib/auth';
import { env } from '@/lib/env';
import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

// PortOne webhook allowed IPs
const getWebhookAllowedIps = (): string[] => {
  const envIps = env.PORTONE_WEBHOOK_ALLOWED_IPS;

  // Parse comma-separated IPs from environment variable
  const customIps = envIps
    .split(',')
    .map((ip) => ip.trim())
    .filter(Boolean);

  return customIps;
};

const WEBHOOK_ALLOWED_IPS = getWebhookAllowedIps();

// Helper function to extract client IP
function getClientIp(req: NextRequest): string | null {
  // Check various headers that might contain the real IP
  const forwardedFor = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  const clientIp = req.headers.get('x-client-ip');

  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(',')[0].trim();
  }

  if (realIp) {
    return realIp.trim();
  }

  if (clientIp) {
    return clientIp.trim();
  }

  return null;
}

/**
 * Middleware for authentication and route protection using better-auth
 *
 * Handles:
 * - Session checking
 * - Role-based access control
 * - Webhook IP whitelisting
 * - Redirect logic
 */
export async function proxy(req: NextRequest) {
  const { nextUrl } = req;

  // Get session from better-auth
  const session = await auth.api.getSession({
    headers: req.headers,
  });
  const isLoggedIn = !!session;

  // Extract user role from session if available
  const userRole = session?.user?.role;

  // Define route patterns
  const isAuthPage = nextUrl.pathname.startsWith('/auth');
  const isPublicPage =
    nextUrl.pathname === '/' ||
    nextUrl.pathname === '/about' ||
    nextUrl.pathname === '/services' ||
    nextUrl.pathname === '/contact' ||
    nextUrl.pathname === '/terms' ||
    nextUrl.pathname === '/error-report';
  const isApiRoute = nextUrl.pathname.startsWith('/api');
  const isAdminRoute = nextUrl.pathname.startsWith('/admin');
  const isGroomerRoute = nextUrl.pathname.startsWith('/groomer');
  const isCustomerRoute = nextUrl.pathname.startsWith('/customer');
  const isDashboardRoute = nextUrl.pathname.startsWith('/dashboard');
  const isPhoneVerificationPage = nextUrl.pathname.startsWith('/auth/verify-phone');
  const isWebhookRoute = nextUrl.pathname.startsWith('/api/v1/webhooks/portone');

  // Check IP whitelist for webhook endpoint
  if (isWebhookRoute) {
    const clientIp = getClientIp(req);

    console.log(`[Webhook] Incoming request from IP: ${clientIp}`);
    console.log(`[Webhook] Headers:`, {
      'x-forwarded-for': req.headers.get('x-forwarded-for'),
      'x-real-ip': req.headers.get('x-real-ip'),
      'x-client-ip': req.headers.get('x-client-ip'),
    });

    // Skip IP whitelist check in development environment
    const isDevelopment = env.NODE_ENV === 'development';
    if (isDevelopment) {
      console.log(`[Webhook] Development mode - allowing all IPs`);
      return NextResponse.next();
    }

    // If we can't determine the IP, log a warning but allow the request
    // This prevents blocking legitimate requests due to header issues
    if (!clientIp) {
      console.warn('[Webhook] Could not determine client IP, allowing request');
      return NextResponse.next();
    }

    // Check if the IP is in the whitelist (production only)
    if (!WEBHOOK_ALLOWED_IPS.includes(clientIp)) {
      console.error(`[Webhook] Blocked request from unauthorized IP: ${clientIp}`);
      return new NextResponse(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { 'content-type': 'application/json' },
      });
    }

    console.log(`[Webhook] Allowed request from IP: ${clientIp}`);
    return NextResponse.next();
  }

  // Allow all other API routes (auth handled at endpoint level)
  if (isApiRoute) {
    return NextResponse.next();
  }

  // Allow public pages
  if (isPublicPage) {
    return NextResponse.next();
  }

  // Allow phone verification page
  if (isPhoneVerificationPage) {
    return NextResponse.next();
  }

  // Redirect to sign in if accessing protected route without being logged in
  if (!isLoggedIn && !isAuthPage) {
    const callbackUrl = nextUrl.pathname + nextUrl.search;
    return NextResponse.redirect(
      new URL(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`, nextUrl)
    );
  }

  // Redirect to appropriate dashboard if accessing auth pages while logged in
  if (isLoggedIn && isAuthPage) {
    // Redirect based on user role
    switch (userRole) {
      case 'ADMIN':
        return NextResponse.redirect(new URL('/admin/dashboard/overview', nextUrl));
      case 'GROOMER':
        return NextResponse.redirect(new URL('/groomer/dashboard/overview', nextUrl));
      case 'CUSTOMER':
        return NextResponse.redirect(new URL('/customer/dashboard/overview', nextUrl));
      default:
        return NextResponse.redirect(new URL('/', nextUrl));
    }
  }

  // Handle generic dashboard route
  if (isLoggedIn && isDashboardRoute && nextUrl.pathname === '/dashboard') {
    switch (userRole) {
      case 'ADMIN':
        return NextResponse.redirect(new URL('/admin/dashboard/overview', nextUrl));
      case 'GROOMER':
        return NextResponse.redirect(new URL('/groomer/dashboard/overview', nextUrl));
      case 'CUSTOMER':
        return NextResponse.redirect(new URL('/customer/dashboard/overview', nextUrl));
      default:
        return NextResponse.redirect(new URL('/', nextUrl));
    }
  }

  // Phone verification check removed - keeping auth minimal
  // No redirects to /settings/profile for phone verification

  // Role-based route protection
  if (isLoggedIn) {
    // Admin routes - only admins can access
    if (isAdminRoute && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', nextUrl));
    }

    // Groomer routes - groomers and admins can access
    if (isGroomerRoute && userRole !== 'GROOMER' && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', nextUrl));
    }

    // Customer routes - customers and admins can access
    if (isCustomerRoute && userRole !== 'CUSTOMER' && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, icon.svg (favicon files)
     * - public assets (logo, manifest, robots, etc.)
     * - API health check endpoints
     */
    '/((?!_next/static|_next/image|favicon.ico|icon.svg|logo.*|manifest.json|robots.txt|sitemap.xml|sw.js|workbox-.*|api/health).*)',
  ],
};
