import { IInputs, IOutputs } from "./generated/ManifestTypes";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
import { bool } from "prop-types";
type DataSet = ComponentFramework.PropertyTypes.DataSet;
import * as $ from 'jquery';
import "jquery-ui";

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
		// Add control initialization code
		this._container = document.createElement("div");
		this._container.className = "table-like sortable";
		this._container.innerText = "Sample";
		this._container.id = "sortable";


		container.appendChild(this._container);
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

			var headers = <HTMLDivElement>document.createElement("div");
			headers.className = "header";
			context.parameters.recordSet.columns.forEach(column => {
				var span = <HTMLSpanElement>document.createElement("span");
				span.className = "element";
				span.innerText = column.displayName;
				headers.appendChild(span);
			});
			this._container.appendChild(headers);


			recordSet.sortedRecordIds.forEach(recordId => {
				var recordDiv = <HTMLDivElement>document.createElement("div");
				recordDiv.className = "row";
				context.parameters.recordSet.columns.forEach(column => {

					if (column.name == "tag") {
						var tagDiv = <HTMLSpanElement>document.createElement("div");
						tagDiv.className = "tags";
						var tags = (<string>recordSet.records[recordId].getValue(column.name)).split(";");

						tags.forEach(tag => {
							var tagSpan = <HTMLSpanElement>document.createElement("span");
							tagSpan.className = "tag";
							tagSpan.innerText = tag;

							if (tag == "urgent")
								tagSpan.style.background = "#E51400";
							if (tag == "blocked")
								tagSpan.style.background = "#FF9642";
							if (tag == "green")
								tagSpan.style.background = "#668D3C";
							if (tag == "stage gate")
								tagSpan.style.background = "#007996";

							tagDiv.appendChild(tagSpan);
						});

						recordDiv.appendChild(tagDiv);
					}
					else {
						var span = <HTMLSpanElement>document.createElement("span");
						span.className = "element";
						span.innerText = <string>recordSet.records[recordId].getValue(column.name);
						recordDiv.appendChild(span);
					}

				});
				this._container.appendChild(recordDiv);
			});
			
			($('.sortable')).css("color","Blue");
			(<any>$('.sortable')).sortable();
			(<any>$('.sortable')).disableSelection();			
		}
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs {
		return {};
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void {
		// Add code to cleanup control if necessary
	}

}