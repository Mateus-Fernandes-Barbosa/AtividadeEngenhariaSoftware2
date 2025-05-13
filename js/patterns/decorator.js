/**
 * Implementação do Padrão Decorator
 * 
 * O Decorator é um padrão estrutural que permite adicionar novos comportamentos
 * a objetos dinamicamente, envolvendo-os em objetos "wrapper" especiais.
 */



/* Semelhante a aceitar qualquer interface ITask, em que task
 * e TaskDecorator implementam essa mesma interface. 
 *
 * Decorator pode recursivamente chamar outro decorator interno como
 * variavel task. 
 * 
 * Logo a classe atual devera percorrer para todos os outros
 * decorators ate atingir a task destino. 
 * 
 * Representacoes html tambem sao obtidas dessa forma recursiva, em que
 * devera ser consultado todos os decoradores e lentamente construir aqueles no
 * qual a representacao html nao foi feita
 */
class TaskDecorator {

    constructor(task) {
        this.task = task;
    }
    
    getId() {
        return this.task.getId();
    }
    
    getTitle() {
        return this.task.getTitle();
    }
    
    getDescription() {
        return this.task.getDescription();
    }
    
    getStatus() {
        return this.task.getStatus();
    }
    
    setStatus(status) {
        this.task.setStatus(status);
    }
    
    getType() {
        return this.task.getType();
    }
    
    getCreatedAt() {
        return this.task.getCreatedAt();
    }
    
    getHtmlRepresentation() {
        return this.task.getHtmlRepresentation();
    }
}

/**
 * Decorador para adicionar alta prioridade a uma tarefa
 */
class HighPriorityDecorator extends TaskDecorator {
    getTitle() {
        const title = this.task.getTitle();
        if (!title.includes('⭐')) {
            return `⭐ ${this.task.getTitle()}`;
        }
        return title;
    }
    
    getHtmlRepresentation() {
        let html = this.task.getHtmlRepresentation();
        
        // Add high-priority-task if not present
        let groupItemTag = 'list-group-item task-item';
        let priorityTag = 'high-priority-task';
        if (!html.includes(priorityTag)) {

            html = html.replace(groupItemTag, `${groupItemTag} ${priorityTag}`);

            // Add new badge to indicate its priority along with type
            html = html.replace('<span class="badge', '<span class="badge bg-danger me-2">PRIORITÁRIO</span><span class="badge');
        }
        return html;
    }
}

/**
 * Decorador para adicionar uma etiqueta colorida a uma tarefa
 */
class ColorLabelDecorator extends TaskDecorator {
    constructor(task, color) {
        super(task);
        this.color = color;
    }
    
    getHtmlRepresentation() {
        let html = this.task.getHtmlRepresentation();


        const wrapper = document.createElement('div');
        const colors = ['label-red', 'label-green', 'label-blue', 'label-yellow'];

        
        wrapper.innerHTML = html;
        const existingLabels = wrapper.querySelectorAll('span.badge');
        for (const label of existingLabels) {
            // If classlist include one of the colors labels
            if ([...label.classList].some(cls => colors.includes(cls))) {
                label.remove();
            }
        }

        if (existingLabels) {
            const firstLabel = wrapper.querySelector('span.badge'); //Get first after removal
            const newlabel = document.createElement('span');
            newlabel.className = `badge label-${this.color} me-2`;
            newlabel.textContent = this.getColorName();
            firstLabel.parentNode.insertBefore(newlabel, firstLabel);
        }
        html = wrapper.innerHTML;
    
        
        return html;
    }
    
    getColorName() {
        switch(this.color) {
            case 'red': return 'Urgente';
            case 'green': return 'Fácil';
            case 'blue': return 'Em progresso';
            case 'yellow': return 'Atenção';
            default: return this.color;
        }
    }
}

/**
 * Decorador para adicionar data de vencimento a uma tarefa
 */
class DueDateDecorator extends TaskDecorator {
    constructor(task, dueDate) {
        super(task);
        this.dueDate = new Date(dueDate);
    }
    
    getHtmlRepresentation() {
        let html = this.task.getHtmlRepresentation();
        // Formatar a data no formato local
        const formattedDate = this.dueDate.toLocaleDateString();
        
        // Adicionar a data de vencimento após a data de criação
        if (!html.includes('due-date')) {
            html = html.replace(
                `Criada em: ${this.task.getCreatedAt().toLocaleString()}`,
                `Criada em: ${this.task.getCreatedAt().toLocaleString()} | <strong class="due-date">Vencimento: ${formattedDate}</strong>`
            );
        }
        return html;
    }
}


/**
 * Decorador para adicionar data de vencimento a uma tarefa
 */
class NotProgressableDecorator extends TaskDecorator {
    constructor(task, dueDate) {
        super(task);
    }
    
    getHtmlRepresentation() {
        let html = this.task.getHtmlRepresentation();
        
        const wrapper = document.createElement('div');
        wrapper.innerHTML = html;

        const btnGroup = wrapper.querySelector('.btn-group');
        console.log(btnGroup);

        const buttons = btnGroup.querySelectorAll('button');
        console.log(buttons);

        for (const button of buttons) {
            if (button.getAttribute('data-status') === 'em_andamento') {
                button.remove();
            }
        }

        html = wrapper.innerHTML;
        return html;
    }
}
