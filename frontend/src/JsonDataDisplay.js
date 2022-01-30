import React from 'react'
import JSON from 'JSON'

class JsonDataDisplay extends React.Component {
  constructor(props) {
    super(props);
		this.json = props.data;
        console.log(props.data);
  }

	render() {
		const DisplayData=this.json.data.PassesList.map(
			(info)=>{
                var vals = [];
                Object.values(info).forEach(value => {vals.push(<td>{value}</td>);});
				return(
                    <tr key={info.PassIndex}>{/* warning if non-unique keys */}
						{vals}
					</tr>
				)
			}
		)
        var headers = [];
        Object.keys(this.json.data.PassesList[0]).forEach(key => {headers.push(<th>{key}</th>);});
		return(
			<div>
				<table className="table table-striped">
					<thead>
						<tr>
                        {headers}
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
