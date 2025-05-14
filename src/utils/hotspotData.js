import * as THREE from "three";
import a1_thumb from "@/assets/a1_thumb.png";
import a2_thumb from "@/assets/a2_thumb.png";
import vp1c_thumb from "@/assets/vp1c_thumb.png";
import hta2_thumb from "@/assets/hta2_thumb.png";
import vtn_thumb from "@/assets/vtn_thumb.png";
import hta1_thumb from "@/assets/hta1_thumb.png";
import ktxb5_thumb from "@/assets/ktxb5_thumb.png";
import stdb5_thumb from "@/assets/stdb5_thumb.png";
import ct_thumb from "@/assets/ct_thumb.png";
import scnt_thumb from "@/assets/scnt_thumb.png";
import a3_thumb from "@/assets/a3_thumb.png";
import tv_thumb from "@/assets/tv_thumb.png";
import ttdmst_thumb from "@/assets/ttdmst_thumb.png";
import ktxb1_thumb from "@/assets/ktxb1_thumb.png";
import ktxb2_thumb from "@/assets/ktxb2_thumb.png";

const HOTSPOTS = [
  {
    id: "vp1",
    buildingId: 5,
    name: "Văn phòng một cửa",
    type: "building",
    thumbnail: vp1c_thumb,
    time: 3.17,
    position: new THREE.Vector3(0, 0, 0),
    scale: [0.0001, 0.0001, 0.0001],
  },
  {
    id: "a1",
    name: "Tòa nhà A1",
    time: 7,
    buildingId: 4,
    thumbnail: a1_thumb,
    type: "building",
    position: new THREE.Vector3(0, 0, 0),
    position: new THREE.Vector3(0, 0, 0),
    scale: [0.0001, 0.0001, 0.0001],
  },
  {
    id: "a2",
    name: "Tòa giảng đường A2",
    buildingId: 3,
    time: 10.02,
    type: "building",
    thumbnail: a2_thumb,
    position: new THREE.Vector3(0, 0, 0),
    scale: [0.0001, 0.0001, 0.0001],
  },
  {
    id: "hta2",
    name: "Hội trường A2",
    type: "room",
    time: 10.02,
    thumbnail: hta2_thumb,
    position: new THREE.Vector3(0, 0, 0),
    scale: [0.0001, 0.0001, 0.0001],
  },
  {
    id: "vtn",
    name: "Vườn thanh niên",
    type: "info",
    time: 12.08,
    thumbnail: vtn_thumb,
    position: new THREE.Vector3(0, 0, 0),
    scale: [0.0001, 0.0001, 0.0001],
  },
  {
    id: "hta1",
    name: "Hội trường A1",
    type: "building",
    time: 12.25,
    thumbnail: hta1_thumb,
    position: new THREE.Vector3(0, 0, 0),
    scale: [0.0001, 0.0001, 0.0001],
  },
  {
    id: "ktxb5",
    name: "Kí túc xã B5",
    type: "info",
    time: 13.23,
    thumbnail: ktxb5_thumb,
    position: new THREE.Vector3(0, 0, 0),
    scale: [0.0001, 0.0001, 0.0001],
  },
  {
    id: "stdb5",
    name: "Sân thể dục B5",
    type: "info",
    time: 14.15,
    thumbnail: stdb5_thumb,
    position: new THREE.Vector3(0, 0, 0),
    scale: [0.0001, 0.0001, 0.0001],
  },
  {
    id: "scnt",
    name: "Sân bóng đá cỏ nhân tạo",
    type: "info",
    time: 15.19,
    thumbnail: scnt_thumb,
    position: new THREE.Vector3(0, 0, 0),
    scale: [0.0001, 0.0001, 0.0001],
  },
  {
    id: "ct",
    name: "Căn tin PTIT",
    type: "info",
    time: 18.06,
    thumbnail: ct_thumb,
    position: new THREE.Vector3(0, 0, 0),
    scale: [0.0001, 0.0001, 0.0001],
  },
  {
    id: "a3",
    name: "Tòa nhà A3",
    type: "building",
    buildingId: 7,
    time: 19.15,
    thumbnail: a3_thumb,
    position: new THREE.Vector3(0, 0, 0),
    scale: [0.0001, 0.0001, 0.0001],
  },

  {
    id: "tv",
    name: "Thư viện PTIT",
    type: "info",
    time: 20.15,
    thumbnail: tv_thumb,
    position: new THREE.Vector3(0, 0, 0),
    scale: [0.0001, 0.0001, 0.0001],
  },

  {
    id: "ttdmst",
    name: "Trung tâm đổi mới sáng tạo CIE",
    time: 22.01,
    type: "info",
    thumbnail: ttdmst_thumb,
    position: new THREE.Vector3(0, 0, 0),
    scale: [0.0001, 0.0001, 0.0001],
  },
  {
    id: "ktxb1",
    name: "Kí túc xá B1",
    time: 22.01,
    type: "info",
    thumbnail: ktxb1_thumb,
    position: new THREE.Vector3(0, 0, 0),
    scale: [0.0001, 0.0001, 0.0001],
  },
  {
    id: "ktxb2",
    name: "Kí túc xá B2",
    time: 22.01,
    type: "info",
    thumbnail: ktxb2_thumb,
    position: new THREE.Vector3(0, 0, 0),
    scale: [0.0001, 0.0001, 0.0001],
  },
];
export { HOTSPOTS };
