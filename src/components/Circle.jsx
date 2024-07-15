import "./Circle.css";

export function Circle(props) {
    const { id} = props;
    return (
        <div id={`circleContainer${id}`} key={id} className="circle-container">
            <div id={id} className="circle" />
        </div>
    );
} 