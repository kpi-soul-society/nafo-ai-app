import type { MDXComponents } from 'mdx/types';
import Link from 'next/link';

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including components from
// other libraries.

// This file is required to use MDX in `app` directory.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Allows customizing built-in components, e.g. to add styling.
    h1: (props) => <h1 className="text-3xl font-bold sm:text-5xl" {...props} />,
    h2: (props) => <h1 className="text-xl font-bold sm:text-3xl" {...props} />,
    ul: (props) => <ul style={{ listStyleType: 'disc', marginLeft: '1.25rem' }} {...props} />,
    li: (props) => <li className="sm:text-xl" {...props} />,
    p: (props) => <p className="text-gray sm:text-xl" {...props} />,
    a: ({ href, children }: any) => {
      if (href.startsWith('/')) {
        return (
          <Link className="hover:text-primary underline" href={href}>
            {children}
          </Link>
        );
      }
      return (
        <a className="hover:text-primary text-primary underline" href={href} target="_blank" rel="noreferrer">
          {children}
        </a>
      );
    },
    ...components,
  };
}
