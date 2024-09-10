// iObservable
//  The "SUBJECT" in the Observer model implements this Interface

import type { iObserver         } from '@/js/interface/iObserver'
import type { iObservedState    } from '@/js/interface/iObservedState'

export
interface iObservable
{
  includeObserver ( observer: iObserver ): void;
  excludeObserver ( observer: iObserver ): void;
  notifyObservers ( arg: iObservedState ): void;
}

export { iObservable as iSubject }

// vim: expandtab number tabstop=2
// END
