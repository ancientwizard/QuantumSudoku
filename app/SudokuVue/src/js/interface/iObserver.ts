
// iObserver
// A class implements the Observer interface when it wants to be informed of changes
//   in Observable objects (AKA: the "subject").

import type { iObservable               } from '@/js/interface/iObservable'
import type { iObservedState            } from '@/js/interface/iObservedState'

export
interface iObserver
{
  update ( subject: iObservable, arg: iObservedState ) : void
}

// vim: expandtab number tabstop=4
// END
