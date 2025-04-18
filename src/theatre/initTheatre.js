import studio from "@theatre/studio";
import extension from "@theatre/r3f/dist/extension";
import cameraSequence from "@/assets/demoScroll.json";
import { getProject } from "@theatre/core";

if (import.meta.env.DEV) {
  studio.initialize();
  studio.extend(extension);
}

const theatreProject = getProject("Scroll Camera Sequence", {
  state: cameraSequence,
});
// const theatreProject = getProject("Scroll Camera Sequence");
theatreProject.ready.then(() => console.log("Project loaded!"));
export default theatreProject;
