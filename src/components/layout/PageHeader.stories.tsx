import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { Button } from '@/components/ui/button';
import { PageHeader } from './PageHeader';

/**
 * PageHeader component displays page title, description, and action buttons in a consistent layout.
 *
 * ## Key Features
 * - Responsive layout (vertical on mobile, horizontal on desktop)
 * - Flexible action button area (using children prop)
 * - Consistent styling and spacing
 */
const meta = {
  title: 'Layout/PageHeader',
  component: PageHeader,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Page header component that provides consistent title, description, and action buttons layout across pages.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Page title',
    },
    description: {
      control: 'text',
      description: 'Page description (optional)',
    },
    children: {
      control: false,
      description: 'Action buttons and other elements',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default state: Simple header with title and description only
 */
export const Default: Story = {
  args: {
    title: 'Booking Management',
    description: 'View and manage your grooming appointments',
  },
};

/**
 * With Actions: Header with action buttons (same as bookings page)
 */
export const WithActions: Story = {
  args: {
    title: 'Booking Management',
    description: 'View and manage your grooming appointments',
    children: (
      <>
        <Button onClick={fn()}>New Booking</Button>
        <Button variant="outline" onClick={fn()}>
          Dashboard
        </Button>
      </>
    ),
  },
};

/**
 * Desktop Short Width: Narrow desktop window layout
 */
export const DesktopShortWidth: Story = {
  args: {
    title: 'Booking Management',
    description: 'View and manage your grooming appointments',
    children: (
      <>
        <Button onClick={fn()}>New Booking</Button>
        <Button variant="outline" onClick={fn()}>
          Dashboard
        </Button>
      </>
    ),
  },
  parameters: {
    viewport: {
      defaultViewport: 'responsive',
      viewports: {
        responsive: {
          name: 'Desktop Short Width',
          styles: {
            width: '800px',
            height: '600px',
          },
        },
      },
    },
    docs: {
      description: {
        story:
          'Desktop layout in a narrow window (800px). Tests how the component handles constrained horizontal space while maintaining desktop breakpoint behavior.',
      },
    },
  },
};

/**
 * Desktop Very Narrow: Extremely constrained desktop width
 */
export const DesktopVeryNarrow: Story = {
  args: {
    title: 'Pet Grooming Management System',
    description: 'Comprehensive platform for managing appointments, pets, and grooming services',
    children: (
      <>
        <Button onClick={fn()}>New Booking</Button>
        <Button variant="outline" onClick={fn()}>
          Dashboard
        </Button>
        <Button variant="outline" onClick={fn()}>
          Settings
        </Button>
      </>
    ),
  },
  parameters: {
    viewport: {
      defaultViewport: 'veryNarrow',
      viewports: {
        veryNarrow: {
          name: 'Desktop Very Narrow',
          styles: {
            width: '600px',
            height: '600px',
          },
        },
      },
    },
    docs: {
      description: {
        story:
          'Very narrow desktop window (600px) with long title and multiple buttons. Tests text wrapping and button overflow behavior.',
      },
    },
  },
};

/**
 * Mobile View: Layout on small screens
 */
export const MobileView: Story = {
  args: {
    title: 'Booking Management',
    description: 'View and manage your grooming appointments',
    children: (
      <>
        <Button onClick={fn()}>New Booking</Button>
        <Button variant="outline" onClick={fn()}>
          Dashboard
        </Button>
      </>
    ),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'On mobile screens, title/description and action buttons are arranged vertically.',
      },
    },
  },
};

/**
 * Desktop Short Width with Long Content: Tests overflow handling
 */
export const DesktopShortWidthLongContent: Story = {
  args: {
    title: 'Comprehensive Pet Grooming and Wellness Management Dashboard',
    description:
      'Advanced platform for managing all aspects of pet grooming services, appointments, customer relationships, and business operations',
    children: (
      <>
        <Button onClick={fn()}>Create New Appointment</Button>
        <Button variant="outline" onClick={fn()}>
          View All Customers
        </Button>
        <Button variant="outline" onClick={fn()}>
          Reports & Analytics
        </Button>
      </>
    ),
  },
  parameters: {
    viewport: {
      defaultViewport: 'shortWidthLong',
      viewports: {
        shortWidthLong: {
          name: 'Desktop Short Width - Long Content',
          styles: {
            width: '700px',
            height: '600px',
          },
        },
      },
    },
    docs: {
      description: {
        story:
          'Tests how very long titles and descriptions wrap, and how multiple action buttons are handled in a constrained desktop width.',
      },
    },
  },
};
