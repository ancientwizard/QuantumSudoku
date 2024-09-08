// Observable.ts

import type { iObservedState    } from 'src/js/interface/iObservedState'
import type { iObservable       } from 'src/js/interface/iObservable'
import type { iObserver         } from 'src/js/interface/iObserver'

export
class Observable implements iObservable
{
    private observers: iObserver[] = [];

    includeObserver ( observer: iObserver ): void {

      // We don't intend to observe ourself in this implementation
      //  The child class should implement this and the super.includeObserver()
      //  called.  In the real world people that "talk" to themselves get funny looks
//    if ( observer == this ) return

      // Keep our observers clean and unique!
      if ( ! this.observers.includes(observer))
             this.observers.push(observer);
    }

    excludeObserver ( observer: iObserver ): void {
      if ( this.observers.includes(observer))
           this.observers = this.observers.filter( obs => obs !== observer );
    }

    notifyObservers ( arg: iObservedState ): void {
      for ( const observer of this.observers )
          observer.update( this, arg );
    }

    // Test Observability
    observers_as_array () : iObserver[]
    {
      return [...this.observers]
      // is cryptic I happen to like
      // return this.observers.filter( () => true )
    }

    get length () { return this.observers.length; }
}

export { Observable as Subject }

// vim: expandtab number tabstop=4
// END
