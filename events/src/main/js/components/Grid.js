import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GridItem from './GridItem'

class Grid extends Component {

 render() {
 return(
   <div>
    <div className="grid">
        {this.createGrid()}
     </div>
   </div>
  );
 }

createGrid() {
     var grid=[];
     var row = []
     console.log("createGrid");
     for (var i=0; i<this.props.rowCount; i++) {
        for (var j=0; j<this.props.columnCount; j++) {
            row.push(<GridItem />);
            console.log("pushing grid item");
         }
        grid.push(<div className="gridRow">{row}</div>);
        row = []

     }
     console.log(grid.length);
     return grid;
 }

}




 Grid.propTypes = {
    rowCount: PropTypes.number.isRequired,
    columnCount: PropTypes.number.isRequired,
    gridItems: PropTypes.array.isRequired
 }


export default Grid;