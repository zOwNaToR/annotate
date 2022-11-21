# Annotate

### **Annote will be implemented with Command Pattern** <br><br>

### **Description:**
The main class will be the **AnnotateEditor** which will be initialized passing an HTMLElement, an optional array of nodes, and an optional callback to respond to the changes. <br>
The **AnnotateEditor** will regoster events like **selectionchange**, **keydown**, **oninput** on the passed HTMLElement and respond to these events creating and dispatching Commands via the **CommandManager**.

### **Basic commands:**
- Write
- NewLine
- Delete
- DeleteSelection
- Copy
- Paste
- Cut
- Undo
- Redo

### **AnnotateEditor will contain an EditorState:**
- AnnotateNode[]
- AnnotateSelection

### **AnnotateEditor will also containt a CommandManager:**
- A stack of Command (CommandHistory)
- Method **do** that will insert command in the stack and remove all following commands (unodoed commands)
- Method **undo** that will return last command with undoed false
- Method **redo** that will return last command with undoed true
- Maybe a position to track the current command?

### **Each Command will inherit from the abstract BaseCommand:**
- Method **execute** that will execute the operation and return a boolean to tell if the operation was successful
- Method **undo** that will set undo the operation based on some fields, set undoed to true and return a boolean to tell if the operation was successful
- Flag **undoable** that indicates if the method undo can be called
- Flag **undoed** that indicated if the method Undo has already been called
- Backup fields to do Undo/Redo <br>
(Ex. WriteCommand: Execute will be an algorithm which will take as param the text/nodes to insert, inserts them and save them in the backup fields)
