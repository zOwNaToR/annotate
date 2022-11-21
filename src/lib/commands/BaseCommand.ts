export abstract class BaseCommand {
   public undoed: boolean = false
   public abstract undoable: boolean

   public abstract execute(): boolean
   public abstract undo(): boolean
}