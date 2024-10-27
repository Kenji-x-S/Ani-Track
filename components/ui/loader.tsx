import React from "react";
import { Dialog, DialogContent } from "./dialog";

const Loader = ({ loading }: { loading: boolean }) => {
  return (
    <Dialog open={loading}>
      <DialogContent className="w-40 h-24">
        <div className="w-full gap-x-2 flex justify-center items-center">
          <div className="w-5 h-5 rounded-full bg-primary animate-bounce">
            <div className="w-full h-full rounded-full bg-primary animate-pulse"></div>
          </div>

          <div className="w-5 h-5 rounded-full bg-primary animate-bounce delay-75">
            <div className="w-full h-full rounded-full bg-primary animate-pulse"></div>
          </div>

          <div className="w-5 h-5 rounded-full bg-primary animate-bounce delay-150">
            <div className="w-full h-full rounded-full bg-primary animate-pulse"></div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Loader;
