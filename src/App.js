import React ,{Component}from 'react';
import MedResult from './ResultComponent.js';
import './App.css';
const Exercise = props => (
  <tr>
    <td>{props.exercise.Drug_Name}</td>
     <td>{props.exercise.Price}</td> 
    <td>{props.exercise.real_Price}</td>
     {/* {<td>
      <Link to={"/edit/"+props.exercise._id}>Buy</Link> 
    </td> } */}
  </tr>
)


class App extends Component{

   constructor(props){

    super(props);

    this.onChangeQuery = this.onChangeQuery.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.searchResults = this.searchResults.bind(this);

    this.state = {
      query: '',
      showResults: false,
       results: []
    }

   }
   onChangeQuery(e) {
    this.setState({
      query: e.target.value
    })
  }
   async onSubmit(e) {
    //this.searchResults();
    e.preventDefault();

    const requestOptions = {
      method: 'GET',
  };

  console.log(this.state.query);
  const k=await fetch('http://localhost:5001/'+this.state.query,requestOptions);
 // .then(response => { console.log(response.json())});
  var body=await k.json();
  console.log("Body "+ body[0].Price);
      this.setState({
        showResults:true,
        results:body
        
      });
     

    
  }
  searchResults () {
      //console.log("Search ");//+body[0].get("Price"));

      return this.state.results.map(currentexercise => {

        return (
        <div className ="container">
                          <div className="col-6 col-md-3 m-2" >

                     <MedResult result={currentexercise} />
        </div>
        </div>);
      })
    }
      // return this.state.exercises.map(currentexercise => {
      //   return <Exercise exercise={currentexercise} />
      // })
          
  
     
   render() {
     
    return (
      <div>
        <h3>Search Medicine</h3>
        <form onSubmit={this.onSubmit}>
          <div className="form-group"> 
            <label>Medicine Name: </label>
            <input  type="text"
                required
                className="form-control"
                value={this.state.query}
                onChange={this.onChangeQuery}
                />
          </div>
          <div className="form-group">
            <input type="submit" value="Search" className="btn btn-primary" />
          </div>
        </form>
        <div className="container">

         {this.state.showResults && <div className="container">
          {/* <thead className="thead-light">

            <tr>
              <th>Name</th>
              <th>MRP</th>
              <th>Discount Price</th>
           
            </tr>
          </thead> */}

          
            { this.searchResults() }
         
        </div>}
        </div>    

          </div>

    )
  }
}

export default App;
