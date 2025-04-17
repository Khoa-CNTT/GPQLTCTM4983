import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import FormZod from "@/components/core/FormZod";
import { useTranslation } from "react-i18next";
import {
  createFundSavingPlanSchema,
  defineCreateFundSavingPlanFormBody,
  generateFrequencyOptions,
  getDaysInMonth
} from "@/core/fund-saving-plan/constants/create-fund-saving-plan.constant";
import { RecurringFrequency } from "@/core/fund-saving-plan/models";
import { IBodyFormField } from "@/types/formZod.interface";

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
  const [currentMonth, setCurrentMonth] = useState<string>((new Date().getMonth() + 1).toString());
  const [selectedDay, setSelectedDay] = useState<string>(new Date().getDate().toString());
  const [selectedFrequency, setSelectedFrequency] = useState<RecurringFrequency>("MONTHLY");

  // Precompute day options based on month and year
  const getDaysForMonth = (month: string, year: number) => {
    const numberOfDays = getDaysInMonth(parseInt(month), year);
    return Array.from({ length: numberOfDays }, (_, i) => i + 1);
  };

  // Initialize form fields once with all possible fields
  const [allFormFields] = useState(() => {
    const days = getDaysForMonth(currentMonth, year);
    return defineCreateFundSavingPlanFormBody(days);
  });

  // Apply visibility based on current frequency without recreating the fields
  const visibleFields = React.useMemo(() => {
    return allFormFields.map(field => {
      if (field.name === 'startDate') {
        return { ...field, hidden: selectedFrequency !== 'DAILY' && selectedFrequency !== 'MONTHLY' };
      } else if (field.name === 'weekDay') {
        return { ...field, hidden: selectedFrequency !== 'WEEKLY' };
      } else if (field.name === 'day') {
        // For day field, update options when month changes but keep visibility rules
        if (field.name === 'day' && currentMonth) {
          const days = getDaysForMonth(currentMonth, year);
          return {
            ...field,
            hidden: selectedFrequency !== 'MONTHLY' && selectedFrequency !== 'ANNUAL',
            dataSelector: days.map(d => ({ value: d.toString(), label: d.toString() }))
          };
        }
        return { ...field, hidden: selectedFrequency !== 'MONTHLY' && selectedFrequency !== 'ANNUAL' };
      } else if (field.name === 'month') {
        return { ...field, hidden: selectedFrequency !== 'ANNUAL' };
      }
      return field;
    });
  }, [allFormFields, selectedFrequency, currentMonth, year]);

  // Handle day selection when month changes
  useEffect(() => {
    if (currentMonth && formRef.current) {
      const numberOfDays = getDaysInMonth(parseInt(currentMonth), year);

      // Adjust selected day if it exceeds the number of days in the month
      if (parseInt(selectedDay) > numberOfDays) {
        setSelectedDay(numberOfDays.toString());
        formRef.current.setValue('day', numberOfDays.toString());
      }
    }
  }, [currentMonth, year, selectedDay]);

  // Watch for form field changes
  useEffect(() => {
    if (!formRef.current) return;

    const subscription = formRef.current.watch((value: any, { name }: any) => {
      if (name === 'month' && value.month) {
        setCurrentMonth(value.month);
      }
      if (name === 'day' && value.day) {
        setSelectedDay(value.day);
      }
      if (name === 'type' && value.type) {
        setSelectedFrequency(value.type);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  // Default form values
  const defaultValues = {
    name: "",
    description: "",
    targetAmount: "",
    trackerTypeId: "",
    month: (new Date().getMonth() + 1).toString(),
    day: new Date().getDate().toString(),
    type: "MONTHLY" as RecurringFrequency,
    weekDay: "1", // Monday as default
    startDate: new Date(),
  };

  const handleCreatePlan = (data: any) => {
    const planData: any = {
      name: data.name,
      description: data.description,
      targetAmount: parseFloat(data.targetAmount.replace(/[^\d.-]/g, '')),
      trackerTypeId: data.trackerTypeId,
      type: data.type,
    };

    // Add appropriate date fields based on frequency type
    if (data.type === 'DAILY') {
      planData.startDate = data.startDate;
    } else if (data.type === 'WEEKLY') {
      planData.weekDay = parseInt(data.weekDay);
    } else if (data.type === 'MONTHLY') {
      planData.day = parseInt(data.day);
      planData.startDate = data.startDate;
    } else if (data.type === 'ANNUAL') {
      planData.month = parseInt(data.month);
      planData.day = parseInt(data.day);
    }

    onCreatePlan(planData);
  };

  return (
    <div className="space-y-4 py-2 pb-4">
      <FormZod
        formSchema={createFundSavingPlanSchema}
        formFieldBody={visibleFields}
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
