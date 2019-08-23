import React from 'react';
import { IPhoto, IDecoded } from '../interfaces';
import { RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import { IGlobalState } from '../reducers';
import { Link } from 'react-router-dom';


interface IPropsGlobal{
    photos: IPhoto[];
    decoded: IDecoded;
    token: string;
    
}


const PhotoUserDetail: React.FC<IPropsGlobal & RouteComponentProps<{photoId: string}>> = props => {
    const {Icon} = require("react-materialize");
    const myPhoto = props.photos.find(p => p._id === props.match.params.photoId)

    if(!myPhoto){
        return null
    }
    return(
        <div className="section container">
            <Link to={"/posts"}>
      <Icon>close</Icon>
      </Link>
        <div className="row">
            <div className="col s12">
            
                
        <img width="100%" src={"http://localhost:8080/uploads/photos/" + myPhoto.filename} alt="photo"/>
        </div>
        
        
        <h6>Title</h6>
        <p>{myPhoto.name}</p>
        <h6>Camera</h6>
        <p>{myPhoto.camera}</p>
        <h6>Localization</h6>
        <p>{myPhoto.localization}</p>
        </div>
        
        
        
        
        
        
    </div>
    )
}
const mapStateToProps = (state: IGlobalState) => ({
    photos: state.photos,
    decoded:state.decoded,
    token:state.token
});
export default connect(mapStateToProps) (PhotoUserDetail);