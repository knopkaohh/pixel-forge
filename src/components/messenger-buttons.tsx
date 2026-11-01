import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MAX_HREF, TELEGRAM_HREF } from "@/lib/contacts";

export function MessengerButtons() {
  return (
    <>
      <Button render={<a href={TELEGRAM_HREF} target="_blank" rel="noopener noreferrer" />}>Написать в Telegram <ArrowRight /></Button>
      <Button variant="outline" render={<a href={MAX_HREF} target="_blank" rel="noopener noreferrer" />}>Написать в Макс</Button>
    </>
  );
}
