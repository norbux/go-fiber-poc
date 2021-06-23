/**
 * Componente de grid para desplegar registros. 
 * Este grid tiene como dependencia, una hoja de estilos preestablecida
 */

let Grid = {};
let self = this;

// The current page in the grid's pagination
Grid.curr = 0;

// The total count of the records before being paginated
Grid.cnt = 0;

// The page size of the pagination
Grid.pgSize = 0;

// The number of pages resulting from the pagination
Grid.pgCount = 0;

// The dataSource property defines a data object or a URL to call via fetch (method GET). The returned JSON object comming from the
// call to the dataSource URL must include a property named "records" that holds the rows to be displayed
Grid.dataSource = '';

// Data source optional parameters. These parameters are used to form a query string or request body depending on the http method 
Grid.dataSourceParams = {};

// HTTP method used by the dataSource. Defaults to GET
Grid.dataSourceMethod = 'get';

// Server-side paging-filtering-sorting switch
Grid.serverProcessing = true;

// Column definition property
Grid.columns = [];

// The key field of each record
Grid.keyField = undefined;

// The value of the keyFiedl of each record
Grid.keyValue = undefined;

// Currently selected key
Grid.selectedKey = undefined;

// Enable or disable pagination
Grid.paginate = true;

// A div element that will hold the grid
Grid.element = undefined;

// An optional grid to function as a detail grid
Grid.detailGrid = undefined;

// Key that binds the main and detail grids
Grid.detailKeyField = '';

// Callback for row selected
Grid.onRowSelected = function(){};

// Localizable labels for the grid. sp-MX is the default, feel free to translate to your desired language
Grid.labels = {
    noDataFound: 'No se encontraron registros',
    currentPage: 'Pag.',
    pageRangeLabel: 'Página',
    pageRangeOf: 'de',
    pageRangeRecords: 'registros'
};

Grid.init = function(current, count, pageSize, pageCount) {
    this.curr = current;
    this.cnt = count;
    this.pgSize = pageSize;
    this.pgCount = pageCount;
};

Grid.buttonAccess = function() {
    if (this.curr === 1)
    {
        let btnFirst = document.getElementById(`btnFirst-${this.element.id}`);
        let btnPrevious = document.getElementById(`btnPrevious-${this.element.id}`);
        btnFirst.setAttribute('disabled', 'disabled');
        btnPrevious.setAttribute('disabled', 'disabled');
    }
    else
    {
        let btnFirst = document.getElementById(`btnFirst-${this.element.id}`);
        let btnPrevious = document.getElementById(`btnPrevious-${this.element.id}`);
        btnFirst.removeAttribute('disabled');
        btnPrevious.removeAttribute('disabled');
    }
    
    if (this.curr < this.pgCount)
    {
        let btnLast = document.getElementById(`btnLast-${this.element.id}`);
        let btnNext = document.getElementById(`btnNext-${this.element.id}`);
        btnLast.removeAttribute('disabled');
        btnNext.removeAttribute('disabled');
    }
    else
    {
        let btnLast = document.getElementById(`btnLast-${this.element.id}`);
        let btnNext = document.getElementById(`btnNext-${this.element.id}`);
        btnLast.setAttribute('disabled', 'disabled');
        btnNext.setAttribute('disabled', 'disabled');
    }
};

Grid.getRecords = function(page, callback) {
    if (page === null || page === undefined)
        page = 1;
    
    this.curr = page;
    let url = `${this.dataSource}`;

    if (this.dataSourceMethod === 'get') {
        // Build the corresponding query
        if (this.paginate === true)
            url = `${url}?page=${page}&paginate=true`;
        else
            url = `${url}?paginate=false`;

        if (Object.keys(this.dataSourceParams).length > 0) {
            let paramCount = Object.keys(this.dataSourceParams).length;

            for(let i = 0; i < paramCount; i++) {
                url = `${url}&${Object.keys(this.dataSourceParams)[i]}=${Object.values(this.dataSourceParams)[i]}`;
            }
        }
    }
    else {
        //TODO: Implement method post
    }

    if (typeof(this.dataSource) === 'string')
        fetch(url, {
            method: 'get',
            headers: {'Content-Type': 'application/json'}
        }).then(resp => {
            return resp.json();
        }).then(resp => {
            this.renderData(resp);
        });
    else {
        let data = {
            records: this.dataSource
        };
        this.renderData(data);
    }
};

let rowSelected = function (grid, obj) {
    grid.dataSourceParams = obj;
    grid.getRecords();
}

// Pager builder function
let buildPager = (grid) => {
    if (grid.element) {
        // Outer div for the pager
        let div = document.createElement('div');
        div.id = `pager-${grid.element.id}`;

        let btnFirst = document.createElement('button');
        btnFirst.id = `btnFirst-${grid.element.id}`;
        btnFirst.classList.add('btn');
        btnFirst.classList.add('btn-sm');
        btnFirst.classList.add('btn-primary');
        btnFirst.innerText = '<<';
        btnFirst.addEventListener('click', event => {
            grid.getRecords(1);
        });
        div.appendChild(btnFirst);

        let btnPrevious = document.createElement('button');
        btnPrevious.id = `btnPrevious-${grid.element.id}`;
        btnPrevious.classList.add('btn');
        btnPrevious.classList.add('btn-sm');
        btnPrevious.classList.add('btn-primary');
        btnPrevious.style.marginLeft = '2px';
        btnPrevious.innerText = '<';
        btnPrevious.addEventListener('click', event => {
            grid.getRecords(grid.curr - 1);
        });
        div.appendChild(btnPrevious);

        let btnCurrent = document.createElement('button');
        btnCurrent.id = `btnCurrent-${grid.element.id}`;
        btnCurrent.classList.add('btn');
        btnCurrent.classList.add('btn-sm');
        btnCurrent.classList.add('btn-secondary');
        btnCurrent.classList.add('disabled');
        btnCurrent.style.marginLeft = '2px';
        btnCurrent.innerText = `${grid.labels.currentPage} ${grid.curr}`;
        div.appendChild(btnCurrent);

        let btnNext = document.createElement('button');
        btnNext.id = `btnNext-${grid.element.id}`;
        btnNext.classList.add('btn');
        btnNext.classList.add('btn-sm');
        btnNext.classList.add('btn-primary');
        btnNext.style.marginLeft = '2px';
        btnNext.innerText = '>';
        btnNext.addEventListener('click', event => {
            grid.getRecords(grid.curr + 1);
        });
        div.appendChild(btnNext);

        let btnLast = document.createElement('button');
        btnLast.id = `btnLast-${grid.element.id}`;
        btnLast.classList.add('btn');
        btnLast.classList.add('btn-sm');
        btnLast.classList.add('btn-primary');
        btnLast.style.marginLeft = '2px';
        btnLast.innerText = '>>';
        btnLast.addEventListener('click', event => {
            grid.getRecords(grid.pgCount);
        });
        div.appendChild(btnLast);

        let pagerRangeLabel = document.createElement('div');
        pagerRangeLabel.id = `pagerLabel-${grid.element.id}`;
        pagerRangeLabel.style.float = 'right';
        pagerRangeLabel.style.padding = '.5em';
        pagerRangeLabel.style.fontSize = '.9em';
        pagerRangeLabel.style.color = 'dodgerblue';
        pagerRangeLabel.innerText = `${grid.labels.pageRangeLabel} ${grid.curr} ${grid.labels.pageRangeOf} ${grid.pgCount} (${grid.cnt} ${grid.labels.pageRangeRecords})`;
        div.appendChild(pagerRangeLabel);

        return div;
    }
}

// Function to return the type of an object
let fieldType = (field) => {
    let type = typeof(field);

    if (type === 'object') {
        if (field instanceof Date)
            return 'date';
    }

    return type;
};

// Function to build a field into a DOM element to be attached as a child to the grid's div
let processField = (value) => {
    // Check field type
    let type = fieldType(value);

    switch (type) {
        case 'string':
            return value;
        case 'number':
            return value;
        case 'bigint': 
            return value;
        case 'date': 
            let date = new Date(value);
            let day = date.getDate().toString();
            day = ((day.length === 1) ? '0' + day.toString() : day.toString());
            let month = (date.getMonth() + 1).toString();
            month = (month.length === 1) ? '0' + month.toString() : month.toString();

            // TODO: take into account different date formats via a grid's porperty
            return `${day}/${month}/${date.getFullYear()}`;
        case 'boolean': 
            return value;
        case 'object': 
            return value;
        case 'symbol': 
            return value;
        default: return value;
    }
};

Grid.renderData = function(data) {
    this.cnt = data.count;
    this.pgCount = Math.ceil(this.cnt / this.pgSize);

    let grd = this.element;
    grd.innerHTML = '';

    // Column count obtained from the returned dataset
    let propertyCount = 0; 
    
    if (data.records.length > 0)
        propertyCount = Object.keys(data.records[0]).length;

    // Set up the column headers
    let outerHeader = document.createElement('div'); // Probemos sin la clase "display-12"
    outerHeader.classList.add('display-12');
    let innerHeader = document.createElement('div');
    innerHeader.style.display = 'flex';
    
    if (this.columns.length > 0) {
        // In this case, the columns were provided by the user so only those columns are built
        for (let i = 0; i < this.columns.length; i++) {
            let header = document.createElement('div');
            header.classList.add('grid-header');
            let cnt = this.columns.filter(c => c.visible === true).length;
            //header.setAttribute('data-cols', this.columns.length);
            header.setAttribute('data-cols', cnt);
            header.innerText = this.columns[i].displayName;

            if (this.columns[i].visible === false)
                header.style.display = 'none';

            innerHeader.appendChild(header);
        }
    }
    else {
        // In this case the user didn't provide any column definition so all the columns are built by default
        for (let i = 0; i < propertyCount; i++) {
            let header = document.createElement('div');
            header.classList.add('grid-header');
            header.setAttribute('data-cols', propertyCount);
            header.innerText = Object.keys(data.records[0])[i];
            innerHeader.appendChild(header);
        }
    }

    outerHeader.appendChild(innerHeader);
    grd.appendChild(outerHeader);

    let rowsDiv = document.createElement('div');

    if (data.records.length > 0) {
        // One or more records were returned
        data.records.forEach(item => {
            // Create a div for the current record
            let div = document.createElement('div');

            // The id DOM attribute is set with a sufix and the value of the keyField for the current record
            div.id = 'record-' + item[this.keyField];
            div.classList.add('grid-row');

            // Loop through the fields of the record to compose the corresponding DOM to be attached to the 
            // above parent div
            if (this.columns.length > 0) {
                // In this case, the columns were provided by the user so only those columns are built
                for (let i = 0; i < this.columns.length; i++) {
                    let field = document.createElement('div');
                    field.classList.add('grid-cell');
                    let cnt = this.columns.filter(c => c.visible === true).length;
                    //field.setAttribute('data-cols', this.columns.length);
                    field.setAttribute('data-cols', cnt);

                    // Build the field into a child DOM element of the grid's div
                    let fieldElement = processField(item[this.columns[i].fieldName]);
                    field.innerHTML = fieldElement;

                    if (this.columns[i].visible === false)
                        field.style.display = 'none';

                    div.appendChild(field);
                    rowsDiv.appendChild(div);
                }
            }
            else {
                // In this case the user didn't provid any column definition so all the columns are built by default
                for (let i = 0; i < propertyCount; i++) {
                    let field = document.createElement('div');
                    field.classList.add('grid-cell');
                    field.setAttribute('data-cols', propertyCount);
    
                    // Build the field into a child DOM element of the grid's div
                    let fieldElement = processField(item[Object.keys(item)[i]]);
                    field.innerHTML = fieldElement;
                    
                    div.appendChild(field);
                    rowsDiv.appendChild(div);
                }
            }

            grd.appendChild(rowsDiv);

            div.addEventListener('click', () => {
                for (var i = 0; i < rowsDiv.children.length; i++)
                    rowsDiv.children[i].classList.remove('grid-row-selected');
                
                div.classList.add('grid-row-selected');
                this.selectedKey = item[this.keyField];

                // Update the keyValue of the grid
                this.keyValue = item[this.keyField];

                // Load detail grid if the user configured it
                if (this.onRowSelected) {
                    this.onRowSelected(this.detailGrid, { [this.detailKeyField]: this.keyValue });
                }
            });
        });

        // Build pager elements if serverProcessing is enabled
        if (this.serverProcessing === true) {
            let pager = buildPager(this);
            grd.appendChild(pager);
        }
        
        this.buttonAccess();
    }
    else {
        // No records were returned
        // Create a div for displaying the grid's label for no records returned
        let div = document.createElement('div');
        div.style.border = '1px solid';
        div.style.borderColor = '#ddd';
        div.style.padding = '20px';
        div.innerHTML = `<span>${this.labels.noDataFound}</span>`;
        grd.appendChild(div);
    }
};