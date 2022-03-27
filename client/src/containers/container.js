import axios from "axios";
import { useQuery } from "react-query";

export default (props) => {
    return (
        <div className="App">{props.children}</div>
    );
}