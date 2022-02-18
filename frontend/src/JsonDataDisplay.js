import React from 'react'
import Papa from "papaparse";
class JsonDataDisplay extends React.Component {
  constructor(props) {
    super(props);
	this.csv = Papa.parse(props.data).data;
  }

	render() {
		const DisplayData=this.csv.map(
			(info)=>{
                var vals = info.map((val) => {return(<td>{val}</td>)})
				return(
                    <tr>{vals}</tr>
				)
			}
		);
		return(
			<div>
				<table className="table table-stripe">
                    <thead>

                        {DisplayData[0]}

                    </thead>
					<tbody>

						{DisplayData.slice(1)}

					</tbody>
				</table>
			</div>
		)
	}
}

export default JsonDataDisplay;
