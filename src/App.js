import React ,{Component}from 'react';
import MedResult from './ResultComponent.js';
import './App.css';



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
  //Triggered when users click search button makes request to our backend which return a json object(an array of hashmaps) 
  //Upon recieving this showResults is triggered (by changing the showResults boolean to true)  which generates JSX element for each array member in the form of MedResult
   async onSubmit(e) {
    e.preventDefault();

    const requestOptions = {
      method: 'GET',
  };

  console.log(this.state.query);
  const k=await fetch('http://localhost:5001/'+this.state.query,requestOptions);
  var body=await k.json();
  console.log("Body "+ body[0].Price);
      this.setState({
        showResults:true,
        results:body
        
      });
     

    
  }
  searchResults () {

      return this.state.results.map(currentexercise => {

        return (
        <div className ="container">
                          <div className="col-6 col-md-3 m-2" >

                     <MedResult result={currentexercise} />
        </div>
        </div>);
      })
    }
    
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
        
            { this.searchResults() }
         
        </div>}
        </div>    

          </div>

    )
  }
}

export default App;
