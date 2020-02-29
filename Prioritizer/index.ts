import { IInputs, IOutputs } from "./generated/ManifestTypes";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
type DataSet = ComponentFramework.PropertyTypes.DataSet;
import * as $ from 'jquery';
import './js/jquery-ui'
import moment = require("moment");

export class Prioritizer implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	private _container: HTMLDivElement;
	private _select: HTMLDivElement;
	private _notifyOutputChanged: () => void;
	private _counter: Number;
	private _dataset: DataSet;
	private _priorityColumn: string;
	private _webAPI: ComponentFramework.WebApi;
	private _entityName: string;

	// private _selectedTags: string[] = [];

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
	constructor() {

	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement) {
		this._select = document.createElement("div");
		this._select.id = "select";
		this._select.className = "selectable-tags";
		this._notifyOutputChanged = notifyOutputChanged;
		container.appendChild(this._select);

		// Add control initialization code
		this._container = document.createElement("div");
		this._container.className = "table-like sortable";
		this._container.innerText = "Sample";
		// this._container.id = "sortable";

		this._priorityColumn = context.parameters.priorityColumn.raw || "";

		this._webAPI = context.webAPI;
		container.appendChild(this._container);
		this._counter = 1;
	}

	private sanitizeNameToCss(name: string): string {
		return name.toLowerCase().replace(' ', '-');
	}

	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void {
		// Add code to update control view

		if (!context.parameters.recordSet.loading) {

			this._container.innerHTML = "";
			var recordSet = context.parameters.recordSet;
			this._dataset = context.parameters.recordSet;

			let allTags: string[] = [];

			var headers = <HTMLDivElement>document.createElement("div");
			headers.className = "header";
			context.parameters.recordSet.columns.forEach(column => {
				var span = <HTMLSpanElement>document.createElement("span");

				//Add a sort class to the header
				let sanitizedName = this.sanitizeNameToCss(column.displayName);
				span.className = "element sort " + sanitizedName;
				span.addEventListener("click", (ev: MouseEvent) => {
					console.trace("Sort " + (<HTMLSpanElement>ev.target).innerText);

					//TODO sort both ways
					let reOrderedDivs = Array.from(this._container.getElementsByClassName('row')).sort((a, b) => { return $(a).find("." + sanitizedName).text().localeCompare($(b).find("." + sanitizedName).text()) });

					//Remove old ones
					reOrderedDivs.forEach(element => { this._container.removeChild(element) });

					//Add new ones
					reOrderedDivs.forEach(element => { this._container.appendChild(element) });
				});

				span.innerText = column.displayName;
				headers.appendChild(span);
			});
			this._container.appendChild(headers);


			recordSet.sortedRecordIds.forEach(recordId => {
				var recordDiv = <HTMLDivElement>document.createElement("div");
				recordDiv.className = "row";
				recordDiv.id = recordSet.records[recordId].getNamedReference().id.toString();
				
				//TODO check this value
				this._entityName = recordSet.records[recordId].getNamedReference().name;

				context.parameters.recordSet.columns.forEach(column => {

					var span = <HTMLSpanElement>document.createElement("span");
					span.className = "element " + this.sanitizeNameToCss(column.displayName);

					if (column.displayName.toLowerCase().includes("date") && recordSet.records[recordId].getValue(column.name) != null) {
						span.innerText = recordSet.records[recordId].getFormattedValue(column.name);
						// span.innerText = moment(<string>recordSet.records[recordId].getValue(column.name), "YYYY-MM-DDTHH:mm:ss.SSSZ").format("YYYY-MM-DD");
					}
					else {
						span.innerText = <string>recordSet.records[recordId].getValue(column.name);
					}

					recordDiv.appendChild(span);

					//TODO add hyperlinks
					//else if (column.displayName == "Subject") {
					// 	var span = <HTMLSpanElement>document.createElement("span");
					// 	span.className = "element " + this.sanitizeNameToCss(column.displayName);;

					// 	var hyperlink = document.createElement("a");
					// 	hyperlink.href = "https://test.crm6.dynamics.com/";
					// 	hyperlink.className = "prioritizer-hyperlink";
					// 	hyperlink.innerText = <string>recordSet.records[recordId].getValue(column.name);
					// 	span.appendChild(hyperlink);
					// 	recordDiv.appendChild(span);
					// }



				});
				this._container.appendChild(recordDiv);
			});

			this._select.innerHTML = '';


			(<any>$('.sortable')).sortable({
				items: 'div[class!=header]',
				stop: (event: Event, ui: Object) => {
					let order = 1;
					Array.from((<HTMLDivElement>event.target).children).forEach(element => {

						if (element.classList.contains('header'))
							return;

						// var shownVal = (<HTMLInputElement>document.getElementById("query")).value;
						// var value2send = (<HTMLInputElement>document.querySelector("#anrede option[value='" + shownVal + "']")).dataset.value;

						//TODO use this._priorityColumn instead of first column
						(<HTMLSpanElement>element.firstChild).innerText = (order).toString();
						var data =
						{
							[this._priorityColumn]: order
						};

						this._webAPI.updateRecord(this._entityName,(<HTMLDivElement>element).id, data);
						order++;

					});
					this._notifyOutputChanged();
				}
			});
			(<any>$('.sortable')).disableSelection();
		}
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs {
		return {
			recordSet: this._dataset
		};
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void {
		// Add code to cleanup control if necessary
	}

}