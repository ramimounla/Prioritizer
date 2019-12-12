import {IInputs, IOutputs} from "./generated/ManifestTypes";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
type DataSet = ComponentFramework.PropertyTypes.DataSet;

export class Prioritizer implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	private _container: HTMLDivElement;
	
	// // Cached context object for the latest updateView
    // private contextObj: ComponentFramework.Context<IInputs>;
    // // Div element created as part of this control's main container
    // private mainContainer: HTMLDivElement;
    // // Table element created as part of this control's table
    // private dataTable: HTMLTableElement;
    // // Button element created as part of this control
    // private loadPageButton: HTMLButtonElement;
	
	// private optionsMapping: string;
	// private yesOption: string | null;
	// private noOption: string | null;

	/**
	 * Empty constructor.
	 */
	constructor()
	{

	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement)
	{
		// Add control initialization code
		this._container = document.createElement("div");
		this._container.innerText = "Sample";
		

		// this.contextObj = context;
        // // Need to track container resize so that control could get the available width. The available height won't be provided even this is true
        // context.mode.trackContainerResize(true);
        // // Create main table container div. 
        // this.mainContainer = document.createElement("div");
        // this.mainContainer.classList.add("SimpleTable_MainContainer_Style");
	 
		// //this.mainContainer.appendChild(this.loadPageButton);
        // container.appendChild(this.mainContainer);
	

		container.appendChild(this._container);
	}


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
		// Add code to update control view

		if (!context.parameters.recordSet.loading) {
			
			this._container.innerHTML = "";
			var recordSet = context.parameters.recordSet;

			context.parameters.recordSet.columns.forEach(column => {
				var div = <HTMLDivElement>document.createElement("div");
				div.innerText = column.displayName;
				this._container.appendChild(div);
			});

			recordSet.sortedRecordIds.forEach(recordId => {
				context.parameters.recordSet.columns.forEach(column => {
					var div = <HTMLDivElement>document.createElement("div");
					div.innerText = <string>recordSet.records[recordId].getValue(column.name);
					this._container.appendChild(div);
				});				
			});
		}

		// this.contextObj = context;
		// // this.ResetOptionMappings(context);
        // //this.toggleLoadMoreButtonWhenNeeded(context.parameters.tableGrid);
        // if (!context.parameters.recordSet.loading) {
        //     // Get sorted columns on View
        //     let columnsOnView = this.getSortedColumnsOnView(context);
        //     if (!columnsOnView || columnsOnView.length === 0) {
        //         return;
        //     }
        //     let columnWidthDistribution = this.getColumnWidthDistribution(context, columnsOnView);
        //     while (this.dataTable.firstChild) {
        //         this.dataTable.removeChild(this.dataTable.firstChild);
        //     }
        //     this.dataTable.appendChild(this.createTableHeader(columnsOnView, columnWidthDistribution));
        //     this.dataTable.appendChild(this.createTableBody(columnsOnView, columnWidthDistribution, context.parameters.tableGrid));
        //     this.dataTable.parentElement!.style.height = window.innerHeight - this.dataTable.offsetTop - 70 + "px";
		// }
		

		// if (!context.parameters.tableGrid.columns) {
        //     return [];
        // }
        // let columns = context.parameters.tableGrid.columns
        //     .filter(function (columnItem: DataSetInterfaces.Column) {
        //         // some column are supplementary and their order is not > 0
        //         return columnItem.order >= 0
        //     }
        //     );
        // // Sort those columns so that they will be rendered in order
        // columns.sort(function (a: DataSetInterfaces.Column, b: DataSetInterfaces.Column) {
        //     return a.order - b.order;
        // });
        // return columns;
    }

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs
	{
		return {};
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void
	{
		// Add code to cleanup control if necessary
	}

}