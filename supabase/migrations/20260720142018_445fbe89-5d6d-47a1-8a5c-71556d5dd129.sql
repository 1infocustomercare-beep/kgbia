
CREATE POLICY "Super admin universal storage read" ON storage.objects FOR SELECT USING (has_role(auth.uid(), 'super_admin'::app_role));
CREATE POLICY "Super admin universal storage delete" ON storage.objects FOR DELETE USING (has_role(auth.uid(), 'super_admin'::app_role));
