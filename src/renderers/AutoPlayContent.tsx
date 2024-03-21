import * as React from 'react';
import { Renderer, Tester } from '../interfaces';

export const AutoPlayContentRenderer: Renderer = (props) => {
    React.useEffect(() => {
        props.action('play');
    }, [props.story])
    const Content = props.story.originalContent;
    return (Content && <Content {...props} />)
}

export const AutoPlayContentTester: Tester = (story) => {
    return {
        condition: !!story.content,
        priority: 2
    }
}

export default {
    renderer: AutoPlayContentRenderer,
    tester: AutoPlayContentTester
}