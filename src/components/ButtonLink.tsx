import type { MouseEventHandler, ReactNode } from "react";

interface Props { href:string; children:ReactNode; variant?:"primary"|"outline"|"quiet"; external?:boolean; onClick?:MouseEventHandler<HTMLAnchorElement>; }

export function ButtonLink({href,children,variant="primary",external=false,onClick}:Props){
  return <a className={`button button--${variant}`} href={href} onClick={onClick} {...(external?{rel:"noreferrer"}:{})}>{children}<span aria-hidden="true">↗</span></a>;
}
