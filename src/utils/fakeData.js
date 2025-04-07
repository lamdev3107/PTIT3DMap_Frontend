const BUILDINGS = [
  {
    id: "a",
    name: "Tòa Nhà Hành Chính",
    position: new THREE.Vector3(0, 0, 0),
    rotation: [0, Math.PI / 2, 0],
    color: "#4285F4",
    scale: [1, 1.5, 1],
    category: "administrative",
    description:
      "Tòa nhà chính của khuôn viên, nơi đặt văn phòng hành chính và các dịch vụ sinh viên.",
    floors: [
      {
        level: 1,
        name: "Tầng 1",
        rooms: [
          { id: "a1", name: "Phòng Tiếp Sinh Viên", type: "office" },
          { id: "a2", name: "Phòng Đào Tạo", type: "office" },
          { id: "a3", name: "Phòng Tài Chính", type: "office" },
          { id: "a4", name: "Phòng Tài Chính", type: "office" },
          { id: "a5", name: "Phòng Tài Chính", type: "office" },
          { id: "a6", name: "Phòng Tài Chính", type: "office" },
          { id: "a7", name: "Phòng Tài Chính", type: "office" },
        ],
      },
      {
        level: 2,
        name: "Tầng 2",
        rooms: [
          { id: "a4", name: "Phòng Hiệu Trưởng", type: "office" },
          { id: "a5", name: "Phòng Công Tác Sinh Viên", type: "office" },
          { id: "a6", name: "Phòng Họp", type: "meeting" },
        ],
      },
    ],
  },
  {
    id: "b",
    name: "Thư Viện",
    position: new THREE.Vector3(-2, 0, 2),
    color: "#EA4335",
    scale: [1, 1, 1],
    rotation: [0, Math.PI, 0],
    category: "library",
    description:
      "Trung tâm học tập với hơn 50,000 đầu sách và không gian học tập hiện đại.",
    floors: [
      {
        level: 1,
        name: "Tầng 1",
        rooms: [
          { id: "b1", name: "Khu vực Sách Tham Khảo", type: "library" },
          { id: "b2", name: "Khu vực Máy Tính", type: "computer_lab" },
          { id: "b3", name: "Quầy Mượn Trả", type: "service" },
        ],
      },
      {
        level: 2,
        name: "Tầng 2",
        rooms: [
          { id: "b4", name: "Khu Đọc Sách", type: "reading" },
          { id: "b5", name: "Phòng Học Nhóm", type: "group_study" },
        ],
      },
    ],
  },
  {
    id: "c",
    name: "Trung Tâm Khoa Học",
    position: new THREE.Vector3(3, 0, 6),
    color: "#FBBC05",
    scale: [1.2, 0.8, 1],
    rotation: [0, Math.PI, 0],
    category: "science",
    description:
      "Nơi diễn ra các hoạt động nghiên cứu và thí nghiệm khoa học của trường.",
    floors: [
      {
        level: 1,
        name: "Tầng 1",
        rooms: [
          { id: "c1", name: "Phòng Thí Nghiệm Vật Lý", type: "lab" },
          { id: "c2", name: "Phòng Thí Nghiệm Hóa Học", type: "lab" },
        ],
      },
      {
        level: 2,
        name: "Tầng 2",
        rooms: [
          { id: "c3", name: "Phòng Nghiên Cứu", type: "research" },
          { id: "c4", name: "Phòng Giảng Viên", type: "office" },
        ],
      },
    ],
  },
  {
    id: "d",
    name: "Trung Tâm Sinh Viên",
    position: new THREE.Vector3(-2, 0, -2),
    color: "#34A853",
    rotation: [0, Math.PI, 0],
    scale: [1, 0.7, 1],
    category: "student",
    description:
      "Không gian dành cho sinh viên thư giãn, tổ chức sự kiện và các hoạt động ngoại khóa.",
    floors: [
      {
        level: 1,
        name: "Tầng 1",
        rooms: [
          { id: "d1", name: "Căn Tin", type: "cafeteria" },
          { id: "d2", name: "Phòng Hoạt Động Câu Lạc Bộ", type: "club" },
        ],
      },
    ],
  },
  {
    id: "e",
    name: "Khoa Kỹ Thuật",
    position: new THREE.Vector3(2, 0, -2),
    color: "#8AB4F8",
    scale: [0.8, 1.2, 1],
    rotation: [0, -Math.PI, 0],
    category: "engineering",
    description:
      "Tòa nhà dành cho khoa kỹ thuật với các phòng học và phòng thực hành hiện đại.",
    floors: [
      {
        level: 1,
        name: "Tầng 1",
        rooms: [
          { id: "e1", name: "Phòng Máy Tính", type: "computer_lab" },
          { id: "e2", name: "Xưởng Thực Hành", type: "workshop" },
        ],
      },
      {
        level: 2,
        name: "Tầng 2",
        rooms: [
          { id: "e3", name: "Phòng Học", type: "classroom" },
          { id: "e4", name: "Phòng Giảng Viên", type: "office" },
        ],
      },
      {
        level: 3,
        name: "Tầng 3",
        rooms: [
          { id: "e5", name: "Phòng Dự Án", type: "project" },
          { id: "e6", name: "Phòng Họp", type: "meeting" },
        ],
      },
    ],
  },
];
