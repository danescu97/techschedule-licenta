from rest_framework import serializers
from .models import Review
from apps.users.serializers import UserSerializer

class ReviewSerializer(serializers.ModelSerializer):
    client_detail = UserSerializer(source='client', read_only=True)

    class Meta:
        model = Review
        fields = '__all__'
        read_only_fields = ('client', 'technician', 'created_at')

    def create(self, validated_data):
        user = self.context['request'].user
        appointment = validated_data['appointment']
        
        # Check if already reviewed
        if Review.objects.filter(appointment=appointment).exists():
            raise serializers.ValidationError({"detail": "Acest serviciu a fost deja evaluat."})
            
        if appointment.client != user:
            raise serializers.ValidationError({"detail": "Nu puteți lăsa review pentru programarea altui utilizator."})
            
        if appointment.status != 'completed':
            raise serializers.ValidationError({"detail": "Programarea trebuie finalizată pentru a lăsa un review."})

        return Review.objects.create(
            client=user,
            technician=appointment.technician,
            **validated_data
        )
