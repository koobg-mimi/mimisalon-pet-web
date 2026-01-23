/**
 * Custom ESLint Rule: typed-nextjs-routes
 *
 * 간단하고 명확하게 Next.js API route handlers의 타입을 강제합니다:
 * 1. Request 파라미터는 NextRequest로 타입 지정
 * 2. 함수는 Promise<NextResponse<T>>로 return type 명시
 *
 * @example ❌ Bad
 * export async function GET(request) {
 *   return NextResponse.json({ data: 'hello' });
 * }
 *
 * @example ✅ Good
 * interface ResponseData {
 *   data: string;
 * }
 *
 * export async function GET(request: NextRequest): Promise<NextResponse<ResponseData>> {
 *   return NextResponse.json({ data: 'hello' });
 * }
 */

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];

/**
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce typed NextRequest and NextResponse in Next.js API routes',
      category: 'TypeScript',
      recommended: true,
    },
    fixable: null,
    schema: [],
    messages: {
      missingRequestType: 'Request parameter must be typed as NextRequest',
      missingReturnType: 'Function must have Promise<NextResponse<T>> return type',
    },
  },

  create(context) {
    const filename = context.getFilename();

    // Only check route.ts files in app/api/
    if (!filename.includes('/app/api/') || !filename.endsWith('route.ts')) {
      return {};
    }

    const sourceCode = context.getSourceCode();
    const text = sourceCode.getText();

    // Check if NextRequest and NextResponse are imported
    const hasNextRequestImport = /import\s+.*\bNextRequest\b.*from\s+['"]next\/server['"]/.test(text);
    const hasNextResponseImport = /import\s+.*\bNextResponse\b.*from\s+['"]next\/server['"]/.test(text);

    return {
      ExportNamedDeclaration(node) {
        const declaration = node.declaration;

        // Check if it's an HTTP method function
        if (
            declaration?.type === 'FunctionDeclaration' &&
            declaration.id &&
            HTTP_METHODS.includes(declaration.id.name)
        ) {
          const functionName = declaration.id.name;

          // Check first parameter (request or { params })
          if (declaration.params.length > 0) {
            const firstParam = declaration.params[0];

            // Case 1: Regular request parameter
            if (firstParam.type === 'Identifier' && firstParam.name === 'request') {
              if (!hasNextRequestImport) {
                context.report({
                  node: firstParam,
                  messageId: 'missingRequestType',
                });
              }
            }
          }

          // Check return type
          if (!declaration.returnType) {
            context.report({
              node: declaration,
              messageId: 'missingReturnType',
            });
          } else if (!hasNextResponseImport) {
            context.report({
              node: declaration.returnType,
              messageId: 'missingReturnType',
            });
          }
        }
      },
    };
  },
};
