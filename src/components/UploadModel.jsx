import { Card, CardHeader } from "@/components/ui/card";
import { UploadCloud } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { AiOutlinePicture } from "react-icons/ai";
import { FaTrashAlt } from "react-icons/fa";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export const UploadModel = ({ models, setModels }) => {
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setModels(files);
    }
  };
  console.log("Chec models", models);
  const handleDeleteModel = (index) => {
    setModels(null);
  };
  console.log("Check models", models?.name);

  return (
  
  );
};
