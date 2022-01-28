import React from 'react'
import Json from './data.json'

class JsonDataDisplay extends React.Component {
  constructor(props) {
    super(props);
		this.json = props.data;
  }

	render() {

		const DisplayData=Json.map(
			(info)=>{
				return(
					<tr>
						<td>{info.PassIndex}</td>
						<td>{info.PassID}</td>
						<td>{info.StationID}</td>
						<td>{info.TimeStamp}</td>
						<td>{info.VehicleID}</td>
						<td>{info.Charge}</td>
					</tr>
				)
			}
		)

		return(
			<div>
				<table className="table table-striped">
					<thead>
						<tr>
						<th>PassIndex</th>
						<th>PassID</th>
						<th>StationID</th>
						<th>TimeStamp</th>
						<th>VehicleID</th>
						<th>Charge</th>
						</tr>
					</thead>
					<tbody>

						{DisplayData}

					</tbody>
				</table>
			</div>
		)
	}
}

export default JsonDataDisplay;
