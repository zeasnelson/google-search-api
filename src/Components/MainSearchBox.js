import React from 'react';
import glogo from '../assets/images/glogo.png';
import upload from '../assets/images/upload.png';
import './MainSearchBox.css'
import Search from './Search';




class MainSearchBox extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      searchPosTop : false,
      googleSearchQuery : '',
      renderTechStack : true,
      errorMsg: "ONLY QCSV FORMAT SUPPORTED!"
    }

    this.inputString = '';
    this.inputBoxRef = React.createRef();
  }

  //this methosd will be removed on the React v17, thus the reason for UNSAFE_
  UNSAFE_componentWillReceiveProps(props){
    this.setState({
      googleSearchQuery : '',
      uploadedData : '',
      fileName : '',
      searchPosTop : false,
      renderTechStack : true,
    });
    this.inputBoxRef.current.value = '';
  }

  //set the position of the status bar
  setSearchBarPos(){
    this.setState( {
      searchPosTop : true,
      renderTechStack : false,
    } );
  }

  //read the value from the search box
  getInputValue(evt){
      let inputBox = this.inputBoxRef.current.value;
      this.inputString = inputBox;
  
  }

  //render an image
  renderIcon(value, id){
    return(
          <img
            className = "icons rounded-circle"
            onClick={ () => {this.search(id)} }
            src = {value}
            alt = {"icon"}
            width = "30"
            height = "30"
          />
                
    );
            
  }

  //extract the file name from a string
  getFileName = (fileName) => {
    if( !fileName ){
      return;
    }
    let index = fileName.lastIndexOf('.');
    let parsedFileName = fileName.substring(index+1);
    return parsedFileName;
  }

  isJsonXmlCsv(fileName){
    return ( fileName === 'json' || fileName === 'xml' || fileName === "csv");
  }

  //method store and pass uploaded data 
  handleChange = (evt) => {
    if( !evt || !evt.target.files[0] )
      return;
    let res;
    let reader = new FileReader();
    let fileName = this.getFileName(evt.target.files[0].name);
    
    if( !this.isJsonXmlCsv(fileName) ){
      this.setState({
        errorMsg: `${fileName} not supported`,
        fileName : '',
        uploadedData : null,
        searchPosTop : false,
      });
      return;
    }

    else{
      if( fileName === "csv"){
        this.setState({errorMsg : "ONLY QCSV FORMAT SUPPORTED!"});
      }
      else
        this.setState({errorMsg : ""});
    }

    reader.readAsText(evt.target.files[0]);
    reader.onload = (e) => {
      res = reader.result;
      this.setState({
          renderTechStack : false,
          fileName : fileName,
          uploadedData : res,
        });
        this.setSearchBarPos();
        this.inputBoxRef.current.value = '';
    }
    
  }

  //render the input box to search on google
  renderInputBox() {
    return (
      <div className= { this.state.searchPosTop ? "search-bar search-top" : "search-bar search-middle"}>

        <div className='icon-outer-box'>
          <div  className='icon-inner-box'>
            {this.renderIcon(glogo, 13)}
          </div>
        </div>
        <input
          ref={this.inputBoxRef}
          className="search-input"
          placeholder={"Search on Google"}
          onChange={ (evt) => { this.getInputValue(evt) } }
          onKeyDown={ (evt) => {this.search(evt.keyCode)} }
          type="text"
        />
        <div className="upload-btn-wrapper">
          <img className="upload-btn" src={upload} width = "30" height = "30" alt="icon"/>
          <input className="" onChange={(evt) => {this.handleChange(evt)}} type="file" id="input"/>
        </div>
      </div>
    );
  }
   

  //to save the search when the enter key is pressed or the google icon is clicked
  search(keyCode){
    if( !keyCode )
      return;
    
    if( keyCode === 13 && this.inputString){
      this.setSearchBarPos();
      this.setState({
        googleSearchQuery : this.inputString,
        uploadedData : '',
        fileName : '',
        errorMsg : '',
      });
    }

  }

  //render the searchbox
  render() {
    return (
      <div className='container'>
        <div className="row h-100">
          <div className="col-sm-12">
            <div className="d-flex justify-content-center">
              <div className = "search-box" >
                {this.renderInputBox()}
                <div className="text-center text-danger">{this.state.errorMsg}</div>
              </div>
            </div>
          </div>
        </div>
        <Search 
          googleSearchQuery={this.state.googleSearchQuery} pageIndex={1}
          uploadedData = {this.state.uploadedData}
          fileName = {this.state.fileName}
          renderTechStack = {this.state.renderTechStack}
          />
      </div>
  );



    }
}


export default MainSearchBox