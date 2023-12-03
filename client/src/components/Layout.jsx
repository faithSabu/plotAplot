import React from "react";

export default function Layout(props) {
  return <div className="min-h-screen flex flex-col">{props.children}</div>;
}
