import React from "react";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";

interface AlertInterface {
  open: boolean;
  title?: string;
  description?: string;
  callback?: () => void;
}

interface Props {
  alert: AlertInterface | null;
}

const Alert: React.FC<Props> = ({ alert }) => {
  if (alert && alert.open)
    return (
      <Dialog open={alert.open ?? false}>
        <DialogContent>
          <DialogTitle style={{ textAlign: "center" }}>
            {alert.title}
          </DialogTitle>
          <p style={{ textAlign: "center" }} id="alert-dialog-description">
            {alert.description}
          </p>
          <DialogFooter style={{ justifyContent: "center" }}>
            <Button onClick={alert.callback} autoFocus>
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  else return null;
};

export default Alert;
