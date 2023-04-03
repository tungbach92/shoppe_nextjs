import Link, {LinkProps} from "next/link";
import {DetailedHTMLProps, FC, HTMLAttributes, HTMLProps, PropsWithChildren} from "react";
import {useRouter} from "next/router";

interface NavLinkProps extends LinkProps, PropsWithChildren {
  className?: string
  exact?: boolean
}

const NavLink: FC<NavLinkProps> = ({
                                     exact = false,
                                     as,
                                     href,
                                     passHref,
                                     replace,
                                     scroll,
                                     shallow,
                                     children,
                                     className,
                                     ...props
                                   }) => {
  const {pathname} = useRouter();
  const isActive = exact ? pathname === href : pathname.startsWith(href as string);

  if (isActive) {
    className += ' active';
  }
  return (
    <Link as={as}
          href={href}
          passHref={passHref}
          replace={replace}
          scroll={scroll}
          shallow={shallow}
          className={className}
          {...props}
    >
      {children}
    </Link>
  )
}

export default NavLink
