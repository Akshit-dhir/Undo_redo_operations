const { builtinModules } = require("module");

class EventSourcer{
    constructor(){
        this.value =0;
        this.add_sub_stack=[]
        this.undo_redo_stack=[]
    }
    add(num) {
        this.value+=num
        this.add_sub_stack.push('A='+ num)
        return this.value
    }
    subtract(num){
        this.value-=num
        this.add_sub_stack.push('S='+num)
        return this.value
    }
    undo()
    {
        if(this.add_sub_stack.length==0)
        {
            return 0;
        }
        else
        {
           var top_value = this.add_sub_stack.pop()
           var values = top_value.split("=")
           if(values[0]==="A")
           {
               this.value-= parseInt(values[1])
           }
           else if(values[0]==="S")
           {
               this.value+=parseInt(values[1])
           }
           this.undo_redo_stack.push(top_value)
        }
        return this.value
    }
    redo()
    {
        if(this.add_sub_stack.length==0 && this.undo_redo_stack.length==0)
        {
           return 0
        }
        else if(this.undo_redo_stack.length==0)
        {
            return this.value
        }
        else
        {
            var top_value = this.undo_redo_stack.pop()
            var values = top_value.split("=")
            if(values[0]==="A")
            {
               this.value+= parseInt(values[1])
            }
            else if(values[0]=="S")
            {
               this.value-=parseInt(values[1])
            }
            this.add_sub_stack.push(top_value)
            return this.value

        }
    }
    bulk_redo(num)
    {
        var num_of_undos_done = this.undo_redo_stack.length;
        if(num_of_undos_done===0 && this.add_sub_stack.length==0)
        {
            return 0
        }
        else if(num_of_undos_done===0)
        {
            return this.value
        }
        else 
        {
           var iterations = num > num_of_undos_done ? num_of_undos_done : num
           while(iterations > 0)
           {
               this.redo()
               iterations--
           }
           return this.value
        }

    }
    bulk_undo(num)
    {
        var num_of_operations_done=this.add_sub_stack.length;
        if(num_of_operations_done==0)
        {
            return 0
        }
        else
        {
            var iterations = num > num_of_operations_done ? num_of_operations_done : num
            while(iterations > 0)
            {
                this.undo()
                iterations--
            }
            return this.value
        }
    }
}
module.exports = EventSourcer