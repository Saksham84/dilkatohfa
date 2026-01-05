"use client";

import * as React from "react";
import { GripVertical } from "lucide-react";
import * as RRP from "react-resizable-panels";

import { cn } from "./utils";

/* ======================================================
   NOTE:
   react-resizable-panels v4 has unstable TS exports.
   Namespace import is the ONLY safe approach.
   ====================================================== */

/* ================= PANEL GROUP ================= */

function ResizablePanelGroup(
  props: React.ComponentProps<any>
) {
  const PanelGroup = (RRP as any).PanelGroup;

  return (
    <PanelGroup
      className={cn(
        "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
        props.className
      )}
      {...props}
    />
  );
}

/* ================= PANEL ================= */

function ResizablePanel(
  props: React.ComponentProps<any>
) {
  const Panel = (RRP as any).Panel;
  return <Panel {...props} />;
}

/* ================= HANDLE ================= */

function ResizableHandle({
  withHandle = false,
  className,
  ...props
}: {
  withHandle?: boolean;
  className?: string;
} & React.ComponentProps<any>) {
  const ResizeHandle = (RRP as any).ResizeHandle || (RRP as any).PanelResizeHandle;

  return (
    <ResizeHandle
      className={cn(
        "relative flex w-px items-center justify-center bg-border " +
          "data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full",
        className
      )}
      {...props}
    >
      {withHandle && (
        <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-background">
          <GripVertical className="h-2.5 w-2.5" />
        </div>
      )}
    </ResizeHandle>
  );
}

export {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
};
