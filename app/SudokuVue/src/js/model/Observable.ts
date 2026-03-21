// Observable.ts

import type { iObservedState    } from '@/js/interface/iObservedState'
import type { iObservable       } from '@/js/interface/iObservable'
import type { iObserver         } from '@/js/interface/iObserver'

// Observer Pattern (Observable aka the Subject)
export
class Observable implements iObservable
{
    private observers: iObserver[] = [];

    public includeObserver ( observer: iObserver ): void
    {
      // We don't intend to observe ourself in this implementation
      //  The child class should implement this in the super.includeObserver()
      //  when called.  In the real world people that "talk" to themselves get funny looks
      // if ( observer === this ) return

      // Keep our observers clean and unique!
      if ( ! this.observers.includes(observer))
             this.observers.push(observer);
    }

    public excludeObserver ( observer: iObserver ): void
    {
      if ( this.observers.includes(observer))
           this.observers = this.observers.filter( obs => obs !== observer );
    }

    public notifyObservers ( arg: iObservedState ): void
    {
      for ( const observer of this.observers )
          observer.update( this, arg );
    }

    // Test Observability
    public observers_as_array () : iObserver[]
    {
      return [...this.observers]
      // is cryptic! I happen to like ... though it too is a bit cryptic
      // return this.observers.filter( () => true )
    }

    get length () { return this.observers.length }
}


// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END
