import { forwardRef } from "react";

const Input = forwardRef((props, ref) => {

    return (
        <input ref={ref} type="text"></input>
    );
});

export default Input;