import React from 'react'
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogTitle } from './ui/dialog'
import { LucideMouse, MousePointerClick, ScrollText } from 'lucide-react'
import { Button } from './ui/button'

export const InstructionDialog = () => {
  return (
    <DialogContent className="sm:max-w-[600px] py-12 px-20 bg-transparen  bg-gradient-to-b from-blue-50 to-indigo-100  text-slate-800 ">

      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-slate-800 text-center mb-2">
          Khám phá khuôn viên trường
        </DialogTitle>
        <DialogDescription className="text-center text-slate-600">
          Dưới đây là hướng dẫn cách khám phá không gian 3D và tìm hiểu về các tòa nhà.
        </DialogDescription>
      </DialogHeader>
      
      <div className="grid grid-cols-2 gap-8 py-6">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-red-primary text-white flex items-center justify-center mb-4">
            <LucideMouse  className="h-8 w-8" />
          </div>
          <h3 className="font-medium mb-2">Cuộn lên và xuống</h3>
          <p className="text-sm text-slate-600">để di chuyển</p>
        </div>
        
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-red-primary  flex items-center justify-center mb-4">
            <div className="w-8 h-8 border-2 border-white rounded-lg rotate-45 flex items-center justify-content-center">
                  <span className='text-white w-full text-xl h-full  -rotate-45'>+</span>
            </div>
          </div>
          <h3 className="font-medium mb-2">Nhấp vào các điểm</h3>
          <p className="text-sm text-slate-600">để tìm hiểu thêm</p>
        </div>
      </div>
      
      <DialogFooter className="flex justify-center">
        <DialogClose asChild>
          <Button className="bg-white mx-auto cursor-pointer text-red-primary hover:bg-red-primary rounded-xl hover:text-white px-8">
            Đã hiểu
          </Button>
        </DialogClose>
      </DialogFooter>
  </DialogContent>
  )
}
