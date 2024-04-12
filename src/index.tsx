import React, { useEffect, useState } from "react";
import {
  ReactInstaStoriesProps,
  GlobalCtx,
  Story,
  Tester,
  Renderer,
} from "./interfaces";
import Container from "./components/Container";
import GlobalContext from "./context/Global";
import StoriesContext from "./context/Stories";
import { getRenderer } from "./util/renderers";
import { renderers as defaultRenderers } from "./renderers/index";
import withHeader from "./renderers/wrappers/withHeader";
import withSeeMore from "./renderers/wrappers/withSeeMore";

const ReactInstaStories = function (props: ReactInstaStoriesProps) {
  let renderers = props.renderers
    ? props.renderers.concat(defaultRenderers)
    : defaultRenderers;
  let context: GlobalCtx = {
    width: props.width,
    height: props.height,
    loader: props.loader,
    header: props.header,
    storyContainerStyles: props.storyContainerStyles,
    storyInnerContainerStyles: props.storyInnerContainerStyles,
    storyStyles: props.storyStyles,
    progressContainerStyles: props.progressContainerStyles,
    progressWrapperStyles: props.progressWrapperStyles,
    progressStyles: props.progressStyles,
    loop: props.loop,
    defaultInterval: props.defaultInterval,
    isPaused: props.isPaused,
    currentIndex: props.currentIndex,
    onStoryStart: props.onStoryStart,
    onStoryEnd: props.onStoryEnd,
    onAllStoriesEnd: props.onAllStoriesEnd,
    onNext: props.onNext,
    onPrevious: props.onPrevious,
    keyboardNavigation: props.keyboardNavigation,
    preventDefault: props.preventDefault,
    preloadCount: props.preloadCount,
    alt: props.alt,
    layout: props.layout,
    objectFit: props.objectFit,
  };

  const [stories, setStories] = useState<{ stories: Story[] }>({
    stories: generateStories(
      props.stories,
      renderers,
      props.alt,
      props.layout,
      props.objectFit
    ),
  });

  useEffect(() => {
    setStories({
      stories: generateStories(
        props.stories,
        renderers,
        props.alt,
        props.layout,
        props.objectFit
      ),
    });
  }, [
    props.stories,
    props.renderers,
    props.alt,
    props.layout,
    props.objectFit,
  ]);

  return (
    <GlobalContext.Provider value={context}>
      <StoriesContext.Provider value={stories}>
        <Container />
      </StoriesContext.Provider>
    </GlobalContext.Provider>
  );
};

const generateStories = (
  stories: Story[],
  renderers: { renderer: Renderer; tester: Tester }[],
  alt = "image",
  layout = "fill",
  objectFit = "cover"
) => {
  return stories.map((s, index) => {
    let story: Story = {
      url: "",
      alt: alt,
      layout: layout,
      objectFit: objectFit,
      loading: "eager",
    };

    if (typeof s === "string") {
      story.url = s;
      story.alt = alt;
      story.layout = layout;
      story.objectFit = objectFit;
      story.type = "image";
      story.loading = "eager";

    //   if (index === 0) {
    //     story.loading = "eager";
    //   } else {
    //     story.loading = "lazy";
    //   }
    } else if (typeof s === "object") {
      story = Object.assign(story, s);
    }

    let renderer = getRenderer(story, renderers);
    story.originalContent = story.content;
    story.content = renderer;
    return story;
  });
};

ReactInstaStories.defaultProps = {
  width: 360,
  height: 640,
  defaultInterval: 4000,
  preloadCount: 1,
};

export const WithHeader = withHeader;
export const WithSeeMore = withSeeMore;

export default ReactInstaStories;
