import React from 'react';
import{Card, CardImg,CardText,CardBody,CardTitle,CardLink} from 'reactstrap';
import {Link} from 'react-router-dom';

const MedResult=(props)=>{
  console.log("ss "+props.result.Drug_Name);
  return(
    <div className="container">
    
   
    <Card className ="center" border="primary" style={{ width: '18rem' }}>
                       <CardImg width='100%' object src={props.result.Photo} alt={props.result.Drug_Name} />
            
        
        <CardBody>  <CardTitle>  {props.result.Drug_Name}</CardTitle>
                    <CardText>
                        <div className="row">
                        MRP- {props.result.Price} 
                        </div>
                        <div className="row">
                           Discounted Price-  {props.result.real_Price}
                        </div >     
                    </CardText>
                  </CardBody>
                  <CardLink href={props.result.Link}>Link</CardLink>
                    </Card>
          
    </div>
   
    );
    

}
export default MedResult;