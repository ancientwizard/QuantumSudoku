
// Observer
// A class implements the Observer interface when it wants to be informed of changes
//   in Observable objects (AKA: the "subject").

export
interface Observer
{
  update ( subject: Observable, arg: ObservedState ) : void
}

// vim: expandtab tabstop=2 number
// END
