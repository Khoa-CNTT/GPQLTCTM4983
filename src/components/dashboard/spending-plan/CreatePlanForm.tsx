import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import FormZod from "@/components/core/FormZod";
import { useTranslation } from "react-i18next";
import { createFundSavingPlanSchema, defineCreateFundSavingPlanFormBody, getDaysInMonth } from "@/core/fund-saving-plan/constants/create-fund-saving-plan.constant";
import { RecurringFrequency } from "@/core/fund-saving-plan/models";

interface ICreatePlanFormProps {
  isOpen: boolean;
  onCreatePlan: (data: any) => void;
  onClose: () => void;
  isLoading: boolean;
}

const CreatePlanForm: React.FC<ICreatePlanFormProps> = ({
  isOpen,
  onCreatePlan,
  onClose,
  isLoading,
}) => {
  const { t } = useTranslation(['common', 'spendingPlan']);
  const formSubmitRef = useRef<HTMLFormElement>(null);
  const formRef = useRef<any>(null);
  const [year] = useState<number>(new Date().getFullYear());
  const [formFields, setFormFields] = useState(defineCreateFundSavingPlanFormBody([]));
  const [currentMonth, setCurrentMonth] = useState<string>((new Date().getMonth() + 1).toString());
  const [selectedDay, setSelectedDay] = useState<string>(new Date().getDate().toString());

  useEffect(() => {
    if (currentMonth) {
      const numberOfDays = getDaysInMonth(parseInt(currentMonth), year);
      const days = Array.from({ length: numberOfDays }, (_, i) => i + 1);
      setFormFields(defineCreateFundSavingPlanFormBody(days));

      if (parseInt(selectedDay) > numberOfDays) {
        setSelectedDay(numberOfDays.toString());
        if (formRef.current) {
          formRef.current.setValue('day', numberOfDays.toString());
        }
      }
    }
  }, [currentMonth, year, selectedDay]);

  useEffect(() => {
    const subscription = formRef.current?.watch((value: any, { name }: any) => {
      if (name === 'month') {
        setCurrentMonth(value.month);
      }
      if (name === 'day') {
        setSelectedDay(value.day);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  const defaultValues = {
    name: "",
    description: "",
    targetAmount: "",
    trackerTypeId: "",
    month: (new Date().getMonth() + 1).toString(),
    day: new Date().getDate().toString(),
    type: "MONTHLY" as RecurringFrequency,
  };

  const handleCreatePlan = (data: any) => {
    const planData = {
      name: data.name,
      description: data.description,
      targetAmount: parseFloat(data.targetAmount.replace(/[^\d.-]/g, '')),
      trackerTypeId: data.trackerTypeId,
      month: parseInt(data.month),
      day: parseInt(data.day),
      type: data.type,
    };

    onCreatePlan(planData);
  };

  return (
    <div className="space-y-4 py-2 pb-4">
      <FormZod
        formSchema={createFundSavingPlanSchema}
        formFieldBody={formFields}
        onSubmit={handleCreatePlan}
        submitRef={formSubmitRef}
        formRef={formRef}
        defaultValues={defaultValues}
        classNameForm="grid grid-cols-2 gap-x-4 gap-y-0"
      />

      <div className="pt-4 flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>
          {t('common:button.cancel')}
        </Button>
        <Button
          onClick={() => formSubmitRef.current?.requestSubmit()}
          disabled={isLoading}
          isLoading={isLoading}
          className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white"
        >
          {t('spendingPlan:form.createPlan')}
        </Button>
      </div>
    </div>
  );
};

export default CreatePlanForm;
