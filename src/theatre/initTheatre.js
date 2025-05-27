// import studio from "@theatre/studio";
// import extension from "@theatre/r3f/dist/extension";
import cameraSequence from "@/assets/project.json";
import { getProject } from "@theatre/core";

// Kiểm tra xem ứng dụng có đang chạy trong môi trường development hay không
if (import.meta.env.MODE == "development") {
  // studio.initialize();
  // studio.extend(extension);
}

const theatreProject = getProject("Scroll Camera Sequence", {
  state: cameraSequence,
});
// const theatreProject = getProject("Scroll Camera Sequence");
theatreProject.ready.then(() => console.log("Project loaded!"));
export default theatreProject;
