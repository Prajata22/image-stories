import * as React from "react";
import Spinner from "../components/Spinner";
import { Renderer, Tester } from "../interfaces";

import Image from "next/image";
import WithHeader from "./wrappers/withHeader";
import WithSeeMore from "./wrappers/withSeeMore";

export const ImageRenderer: Renderer = ({ story, action, isPaused, config }) => {
  const [loaded, setLoaded] = React.useState(false);
  const { width, height, loader, storyStyles } = config;
  let computedStyles = {
    ...styles.storyContent,
    ...(storyStyles || {}),
  };

  const imageLoaded = () => {
    setLoaded(true);
    action("play");
  };
  return (
    <WithHeader {...{ story, globalHeader: config.header }}>
      <WithSeeMore {...{ story, action }}>
        <div>
          <Image 
            style={computedStyles} 
            src={story.url} 
            onLoad={imageLoaded} 
            alt={story.alt}
            layout={story.layout || "fill"}
            objectFit={story.objectFit || "cover"}
            placeholder="blur"
            blurDataURL={story.url}
            loading={story.loading || "eager"}
          />
          {!loaded && (
            <div
              style={{
                width: width,
                height: height,
                position: "absolute",
                left: 0,
                top: 0,
                background: "#fff",
                zIndex: 9,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#ccc",
              }}
            >
              {loader || <Spinner />}
            </div>
          )}
        </div>
      </WithSeeMore>
    </WithHeader>
  );
};

const styles = {
  story: {
    display: "flex",
    position: "relative",
    overflow: "hidden",
  },
  storyContent: {
    width: "auto",
    maxWidth: "100%",
    maxHeight: "100%",
    margin: "auto",
  },
};

export const tester: Tester = (story) => {
  return {
    condition: !story.content && (!story.type || story.type === "image"),
    priority: 2,
  };
};

export default {
  renderer: ImageRenderer,
  tester,
};
