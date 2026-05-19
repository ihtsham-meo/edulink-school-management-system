export const normalizeStudents = (payload) => {
  const items = Array.isArray(payload)
    ? payload
    : payload?.data?.data ||
      payload?.data?.students ||
      payload?.data ||
      payload?.students ||
      [];

  if (!Array.isArray(items)) return [];

  return items.map((student) => {
    const profile = student.profile || student.student_profile || {};
    return {
      id: student.id,
      name: student.name || "",
      rollNo: profile.roll_number || profile.admission_number || "",
      admissionNumber: profile.admission_number || "",
      class:
        profile.class?.name ||
        profile.class_name ||
        student.class_name ||
        "",
      section:
        profile.section?.name ||
        profile.section_name ||
        student.section_name ||
        "",
      gender: profile.gender || student.gender || "",
      status: student.status || "active",
      phone: student.phone || "",
      email: student.email || "",
      fee: student.fee || "pending",
      dob: profile.date_of_birth || "",
      address: profile.address || "",
      bloodGroup: profile.blood_group || "",
      fatherName: profile.father_name || profile.parent_name || "",
      motherName: profile.mother_name || "",
      parentPhone: profile.parent_phone || student.phone || "",
      username: student.username || student.email || "",
      password: student.password || "********",
    };
  });
};

export const printHtml = (title, bodyHtml) => {
  const printWindow = window.open("", "_blank", "width=1100,height=800");
  printWindow.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; color: #111827; padding: 24px; }
          h1, h2, h3 { margin: 0; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
          th { background: #f3f4f6; }
          .muted { color: #6b7280; }
          .card { border: 1px solid #d1d5db; border-radius: 12px; padding: 16px; margin-bottom: 16px; }
          .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
          .field-label { color: #6b7280; font-size: 11px; }
          .field-value { font-weight: 700; font-size: 14px; margin-top: 2px; }
          .signatures { display: flex; justify-content: space-between; margin-top: 48px; }
          @media print { button { display: none; } }
        </style>
      </head>
      <body>${bodyHtml}<script>window.onload = () => { window.print(); };</script></body>
    </html>
  `);
  printWindow.document.close();
};
