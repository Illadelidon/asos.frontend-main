import {Link} from "react-router-dom";

const NotFound=()=>
{
    return(
        <>
            <div className="main">
                <div className={"forbidden"}>
                    <header className="intro">
                        <h1 className="intro__headline">Error 404</h1>
                        <p className="intro__subhead">The page does not exist</p>
                        <Link className="magic-light" to="/" >Return to the main page</Link>
                    </header>
                </div>
            </div>
        </>
    )
}

export default NotFound;