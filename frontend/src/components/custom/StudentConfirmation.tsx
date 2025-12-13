// 'use client';
// import Button from '@/components/custom/mobile/ui/Button';
// import Dropdown from '@/components/custom/Dropdown';
// import Iconify from '@/components/custom/mobile/ui/Iconify';
// import LabelInput from '@/components/custom/mobile/ui/LabelInput';
// import { useState } from 'react';

// interface StudentConfirmationProps {
//   student: any;
//   onConfirm: () => void;
// }

// export default function StudentConfirmation({ student, onConfirm }: StudentConfirmationProps) {
//   const [selectedReason, setSelectedReason] = useState('');
//   const isButtonDisabled = selectedReason === '';

//   return (
//     <div className="flex flex-col w-full h-full gap-[10px]">
//       <div className="flex flex-row w-full h-fit items-center justify-center gap-[5px] p-[10px]">
//         <Iconify icon="material-symbols:info-outline" size={15} />
//         <p className="font-light text-[10px]">
//           Please ensure details are correct before confirming.
//         </p>
//       </div>
//       {student && (
//         <>
//           <LabelInput label="Full Name" value={student.name} />

//           <div className="flex flex-row gap-[10px]">
//             <LabelInput label="Student NISN" value={student.nis} className="flex-1" />
//             <LabelInput label="Class" value={student.kelas} className="flex-1" />
//           </div>

//           <Dropdown
//             placeholder="Select a reason..."
//             options={[
//               { label: 'Forgot ID Card', value: 'forgot' },
//               { label: 'Lost ID Card', value: 'lost' },
//               { label: 'Sick / Permission', value: 'permission' },
//               { label: 'Explanation', value: 'explanation' },
//             ]}
//             onChange={(e) => setSelectedReason(e.target.value)}
//             value={selectedReason}
//           />

//           <br />

//           <Button
//             text="Confirm Attendance"
//             variant={isButtonDisabled ? 'button-disable' : 'button-enable'}
//             onClick={isButtonDisabled ? undefined : onConfirm}
//             disabled={isButtonDisabled}
//           />
//         </>
//       )}
//     </div>
//   );
// }
