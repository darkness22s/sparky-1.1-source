import { CornerUpRightIcon, ListEndIcon, Trash2Icon } from "lucide-react";
import { memo } from "react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { queuedComposerMessagePreview, type QueuedComposerMessage } from "./steeringQueue";

interface ComposerQueuedMessagesProps {
  readonly messages: ReadonlyArray<QueuedComposerMessage>;
  readonly onSteer: (messageId: string) => void;
  readonly onDelete: (messageId: string) => void;
  readonly steerDisabled: boolean;
}

export const ComposerQueuedMessages = memo(function ComposerQueuedMessages({
  messages,
  onSteer,
  onDelete,
  steerDisabled,
}: ComposerQueuedMessagesProps) {
  if (messages.length === 0) {
    return null;
  }

  return (
    <div
      aria-label="Queued messages"
      className="border-border/70 bg-muted/25 divide-border/70 divide-y border-b"
      data-chat-composer-queued-messages
    >
      {messages.map((message) => {
        const preview = queuedComposerMessagePreview(message);
        return (
          <div
            className="flex min-w-0 items-center gap-2 px-3 py-2.5 sm:px-4"
            data-chat-composer-queued-message={message.id}
            key={message.id}
          >
            <ListEndIcon aria-hidden="true" className="text-muted-foreground size-4 shrink-0" />
            <p
              className={cn("text-foreground min-w-0 flex-1 truncate text-sm", {
                "text-muted-foreground": preview === "Queued message",
              })}
              title={preview}
            >
              {preview}
            </p>
            <Button
              aria-label={`Steer queued message: ${preview}`}
              className="shrink-0 gap-1.5"
              disabled={steerDisabled}
              onClick={() => onSteer(message.id)}
              size="sm"
              title="Send this message now"
              type="button"
              variant="outline"
            >
              <CornerUpRightIcon aria-hidden="true" className="size-3.5" />
              <span>Steer</span>
            </Button>
            <Button
              aria-label={`Delete queued message: ${preview}`}
              className="text-muted-foreground hover:text-destructive shrink-0"
              onClick={() => onDelete(message.id)}
              size="icon-sm"
              title="Delete queued message"
              type="button"
              variant="ghost"
            >
              <Trash2Icon aria-hidden="true" className="size-4" />
            </Button>
          </div>
        );
      })}
    </div>
  );
});
