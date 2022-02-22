import React from 'react'
import Papa from 'papaparse';
import './CSVdataDisplay.css';

class CSVdataDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.csv = Papa.parse(props.data).data;
    }

    normalDisplayData(csv){
        var DisplayData=csv.map(
			(info)=>{
                var vals = info.map((val) => {return(<td>{val}</td>)})
				return(
                    <tr>{vals}</tr>
				)
			}
		);
        return DisplayData;
    }

    settleDisplayData(csv, show_settled){
        //check if pass is settled
        var vals = [<tr>{csv[0].slice(0, 6).map((val => {return(<td>{val}</td>)}))}</tr>]; //initialized with headers
        for(const info of csv.slice(1)){
            if(info[6] == 0){
                vals.push(<tr className='not-settled'>{info.slice(0, 6).map((val => {return(<td>{val}</td>)}))}</tr>);
            }else{
                if(show_settled == true){
                    vals.push(<tr className='settled'>{info.slice(0, 6).map((val => {return(<td>{val}</td>)}))}</tr>);
                }
            }
        }
        return vals;
    }

	render() {
        var DisplayData;
        if(this.props.display == 'settle'){
            console.log('SETTLE');
            DisplayData = this.settleDisplayData(this.csv, this.props.show_settled);
        }else{
            console.log('NORMAL');
            DisplayData = this.normalDisplayData(this.csv);
        }
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
		);
	}
}

export default CSVdataDisplay;
